import { Injectable } from '@nestjs/common';
import {
  ChatInputCommandInteraction,
  CacheType,
  ModalSubmitInteraction,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { CardData } from 'src/database/models';
import { GameCardService } from 'src/database/services/game-card/game-card.service';
import { MetadataService } from 'src/database/services/metadata/metadata.service';
import { RoleService } from 'src/discord/services/role/role.service';
import { LoggingService } from 'src/observability/services/logging/logging.service';
import { ComponentRootService } from 'src/ui/components/component-root.service';
import { Command, ModalHandler } from '../command.interface';

@Injectable()
export class AddCardCommand implements Command, ModalHandler {
  commandName = 'addgame';

  description = 'Add a game card to the channel';

  modalId = 'addgamemodal';

  constructor(
    private gameCardService: GameCardService,
    private metadataService: MetadataService,
    private componentRootService: ComponentRootService,
    private roleService: RoleService,
    private logger: LoggingService,
  ) {}

  async run(command: ChatInputCommandInteraction<CacheType>): Promise<void> {
    this.logger.log('executing add game command');
    const metadata = this.metadataService.getMetadata(command.guildId);

    if (metadata == null) {
      command.reply(
        'server not yet initialized with game channel.  Please setup a channel using /gamegroupchannel.',
      );
      return;
    }

    const modal = new ModalBuilder()
      .setCustomId(this.modalId)
      .setTitle('Add game card');

    const groupNameInput = new TextInputBuilder()
      .setCustomId('groupNameInput')
      .setLabel('Game Name')
      .setStyle(TextInputStyle.Short);

    const roleTagInput = new TextInputBuilder()
      .setCustomId('roleTagInput')
      .setLabel('Group Tag')
      .setStyle(TextInputStyle.Short);

    const gameImageInput = new TextInputBuilder()
      .setCustomId('gameImageInput')
      .setLabel('Game Image Link')
      .setStyle(TextInputStyle.Short);

    const gameDescription = new TextInputBuilder()
      .setCustomId('descriptionInput')
      .setLabel('Description')
      .setStyle(TextInputStyle.Paragraph);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(groupNameInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(roleTagInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(gameDescription),
    );

    await command.showModal(modal);
    this.logger.log('send add game modal');
  }

  async handleModalSubmit(
    command: ModalSubmitInteraction<CacheType>,
  ): Promise<void> {
    try {
      this.logger.log('recieved submission for add card modal');
      const title = command.fields.getTextInputValue('groupNameInput');
      const roleTag = command.fields.getTextInputValue('roleTagInput');
      const gameImageSrc = '';
      const description = command.fields.getTextInputValue('descriptionInput');

      const roleId = await this.roleService.createRole(
        command.guildId,
        roleTag,
      );

      try {
        const cardData: CardData = {
          serverId: command.guildId,
          description,
          gameImageSrc,
          roleTag,
          roleId,
          title,
          userTags: [],
          userIds: [],
        };

        const newCard = await this.gameCardService.create(cardData);
        this.logger.log(`Added new card ${newCard.entityId}`);
      } catch (e) {
        this.logger.log('Unexpected error, cleaning up role');
        await this.roleService.deleteRole(command.guildId, roleId);
        throw e;
      }

      command.reply({ content: 'Added your new game!', ephemeral: true });

      // refresh ui after the update
      this.componentRootService.render(command.guildId);
    } catch (e) {
      this.logger.error(
        'Encountered error handling add card modal submission',
        e,
      );
      command.reply({
        content: 'Something went wrong, please try again',
        ephemeral: true,
      });
    }
  }
}
