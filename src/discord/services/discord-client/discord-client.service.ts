import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
  REST,
  RequestData,
  Interaction,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
  MessageReaction,
  PartialMessageReaction,
  User,
  PartialUser,
} from 'discord.js';
import { ConfigService } from 'src/config/services/config-service/config.service';
import { LoggingService } from 'src/observability/services/logging/logging.service';
import { waitForCondition } from 'src/utils/wait';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface DiscordClientServiceConfig {
  loginToken: string;
  clientId: string;
  guildId: string;
  botUserId: string;
}

@Injectable()
export class DiscordClientService implements OnModuleInit {
  private client: Client<true>;
  private restClient: REST;
  private config: DiscordClientServiceConfig;

  private interactions$: Subject<Interaction>;
  private commands$: Observable<ChatInputCommandInteraction>;
  private modalSubmissions$: Observable<ModalSubmitInteraction>;

  private reactions$: Subject<[MessageReaction, User, Events]>;

  constructor(
    private logger: LoggingService,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    this.config = this.configService.getDiscordServiceConfig();

    const startupClient: Client<false> = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
      ],
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.User,
      ],
    });

    startupClient.once(Events.ClientReady, this.onClientReady.bind(this));

    startupClient.login(this.config.loginToken);

    this.restClient = new REST().setToken(this.config.loginToken);
  }

  getGuildId() {
    return this.config.guildId;
  }

  getClientId() {
    return this.config.clientId;
  }

  getBotUserId() {
    return this.config.botUserId;
  }

  getInteractionsStream() {
    if (!this.interactions$) {
      this.listenToInteractions();
    }
    return this.interactions$;
  }

  getCommandStream() {
    if (!this.commands$) {
      this.listenToCommands();
    }
    return this.commands$;
  }

  getModalStream() {
    if (!this.modalSubmissions$) {
      this.listenToModals();
    }
    return this.modalSubmissions$;
  }

  getReactionStream() {
    if (!this.reactions$) {
      this.listenToReactions();
    }
    return this.reactions$;
  }

  async onClientReady(client: Client<true>) {
    this.logger.log('Discord client ready');
    this.client = client;
  }

  async waitForClient(): Promise<void> {
    await waitForCondition(() => !!this.client);
  }

  async getGuildManager() {
    await this.waitForClient();
    return this.client.guilds;
  }

  async getUserManager() {
    await this.waitForClient();
    return this.client.users;
  }

  async getChannelManager() {
    await this.waitForClient();
    return this.client.channels;
  }

  async getRoleManager(serverId: string) {
    await this.waitForClient();
    const guildManager = await this.getGuildManager();
    const guild = await guildManager.fetch(serverId);
    return guild.roles;
  }

  async getMemberManager(serverId: string) {
    await this.waitForClient();
    const guildManager = await this.getGuildManager();
    const guild = await guildManager.fetch(serverId);
    return guild.members;
  }

  private listenToInteractions() {
    if (!!this.interactions$) {
      this.logger.error('tried to re-initialize interactions listener');
      throw Error('tried to re-initialize interactions listener');
    }

    this.interactions$ = new Subject();
    this.client.on(Events.InteractionCreate, (interaction) => {
      this.interactions$.next(interaction);
    });
  }

  // indirection required for ts typeguard to work with rxjs
  private isInteractionCommand(
    interaction: Interaction,
  ): interaction is ChatInputCommandInteraction {
    return interaction.isChatInputCommand();
  }

  private isModalSubmission(
    interaction: Interaction,
  ): interaction is ModalSubmitInteraction {
    return interaction.isModalSubmit();
  }

  private listenToCommands() {
    if (!!this.commands$) {
      this.logger.error('tried to re-initialize commands listener');
      throw Error('tried to re-initialize commands listener');
    }

    const source$ = this.getInteractionsStream();
    this.commands$ = source$.pipe(filter(this.isInteractionCommand));
  }

  private listenToModals() {
    if (!!this.modalSubmissions$) {
      this.logger.error('tried to re-initialize commands listener');
      throw Error('tried to re-initialize commands listener');
    }

    const source$ = this.getInteractionsStream();
    this.modalSubmissions$ = source$.pipe(filter(this.isModalSubmission));
  }

  private isPartialReaction(
    reaction: MessageReaction | PartialMessageReaction,
  ): reaction is PartialMessageReaction {
    return reaction.partial;
  }

  private async populateReaction(
    reaction: MessageReaction | PartialMessageReaction,
  ): Promise<MessageReaction> {
    if (this.isPartialReaction(reaction)) {
      return await reaction.fetch();
    } else {
      return reaction;
    }
  }

  private isPartialUser(user: User | PartialUser): user is PartialUser {
    return user.partial;
  }

  private async populateUser(user: User | PartialUser): Promise<User> {
    if (this.isPartialUser(user)) {
      return await user.fetch();
    } else {
      return user;
    }
  }

  private listenToReactions() {
    if (!!this.reactions$) {
      this.logger.error('tried to re-initialize reactions listener');
      throw Error('tried to re-initialize reactions listener');
    }

    this.reactions$ = new Subject();
    this.client.on(Events.MessageReactionAdd, async (reaction, user) => {
      try {
        const fullReaction = await this.populateReaction(reaction);
        const fullUser = await this.populateUser(user);

        this.reactions$.next([
          fullReaction,
          fullUser,
          Events.MessageReactionAdd,
        ]);
      } catch (error) {
        console.error(
          'Something went wrong when fetching the reaction data:',
          error,
        );
        throw error;
      }
    });

    this.client.on(Events.MessageReactionRemove, async (reaction, user) => {
      try {
        const fullReaction = await this.populateReaction(reaction);
        const fullUser = await this.populateUser(user);

        this.reactions$.next([
          fullReaction,
          fullUser,
          Events.MessageReactionRemove,
        ]);
      } catch (error) {
        console.error(
          'Something went wrong when fetching the reaction data:',
          error,
        );
        throw error;
      }
    });
  }

  // This Rest api is awful.  Consider abstracting it away further somewhere
  async sendRestCall(route: `/${string}`, data: RequestData) {
    try {
      this.logger.log(`Sending rest call at: ${route}`);
      await this.restClient.put(route, data);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}

// // Require the necessary discord.js classes
// const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
// const { token } = require('./config.json');

// // Create a new client instance
// const client = new Client({
//     intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
//     partials: ['CHANNEL', 'GUILD_MEMBER', 'GUILD_SCHEDULED_EVENT', 'MESSAGE', 'REACTION', 'USER'] // all partials
// });

// console.log('STARTED')

// // When the client is ready, run this code (only once)
// // We use 'c' for the event parameter to keep it separate from the already defined 'client'
// client.once(Events.ClientReady, async (c: any) => {

//     const guild = c.guilds.resolve('1049005363950792784')
//     const role = await guild.roles.create({ name: 'Test Role'})

//     role.members

// 	console.log(`Ready! Logged in as ${c.user.tag}`);
//     // const channel = await c.channels.fetch('1049005365443969086')

//     // const message = await channel.messages.fetch('1049024087164473405')

//     // // inside a command, event listener, etc.
//     // const exampleEmbed = new EmbedBuilder()
//     //     .setColor(0x0099FF)
//     //     .setTitle('Warzone 2')
//     //     .setURL('https://discord.js.org/')
//     //     // .setAuthor({ name: 'Some name', iconURL: 'https://media.gamestop.com/i/gamestop/11206901-11206901?fmt=auto&$pdp-gallery$', url: 'https://discord.js.org' })
//     //     .setDescription('Some description here')
//     //     // .setThumbnail('https://i.imgur.com/AfFp7pu.png')
//     //     .addFields(
//     //         { name: 'Group Tag', value: '@clickers' },
//     //         { name: 'Members', value: '@ablbebxb @maxwell @keviiinnn' },
//     //     )
//     //     .setImage('https://media.gamestop.com/i/gamestop/11206901-11206901?fmt=auto&$pdp-gallery$')
//     //     .setFooter({ text: 'Some footer text here', iconURL: 'https://media.gamestop.com/i/gamestop/11206901-11206901?fmt=auto&$pdp-gallery$' });

//     // // const m = await channel.send('123');
// 	// // console.log('Sent message');

//     // await message.edit({ embeds: [exampleEmbed] })

//     // await message.react('🥾')
//     // await message.react('🧦')

// 	// console.log('Edited message');

//     // function f(reaction) {
//     //     console.log(reaction)
//     //     return reaction.emoji.name === '🥾'
//     // }

//     // const messag2e = await channel.messages.fetch('1049024087164473405')
//     // const collector = message.createReactionCollector({ time: 15000 })

//     // collector.on('collect', (reaction, user) => {
//     //     console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
//     // });

//     // collector.on('end', collected => {
//     //     console.log(`Collected ${collected.size} items`);
//     //     process.exit()
//     // });

// });

// // client.on(Events.MessageReactionAdd, async (reaction, user) => {
// // 	// When a reaction is received, check if the structure is partial
// // 	if (reaction.partial) {
// // 		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
// // 		try {
// // 			await reaction.fetch();
// // 		} catch (error) {
// // 			console.error('Something went wrong when fetching the message:', error);
// // 			// Return as `reaction.message.author` may be undefined/null
// // 			return;
// // 		}
// // 	}

// // 	// Now the message has been cached and is fully available
// // 	console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
// // 	// The reaction is now also fully available and the properties will be reflected accurately:
// // 	console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
// // });

// // Log in to Discord with your client's token
// client.login(token);
