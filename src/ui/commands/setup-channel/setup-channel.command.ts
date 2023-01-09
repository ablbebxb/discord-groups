import { Injectable } from '@nestjs/common';
import { ChatInputCommandInteraction, CacheType } from 'discord.js';
import { ServerMetadata } from 'src/database/models/metadata';
import { MetadataService } from 'src/database/services/metadata/metadata.service';
import { ChannelService } from 'src/discord/services/channel/channel.service';
import { LoggingService } from 'src/observability/services/logging/logging.service';
import { Command } from '../command.interface';

@Injectable()
export class SetupChannelCommand implements Command {
  commandName = 'gamegroupchannel';

  description = 'initialize a channel for the bot to manage';

  constructor(
    private metadataService: MetadataService,
    private channelService: ChannelService,
    private logger: LoggingService,
  ) {}

  async run(command: ChatInputCommandInteraction<CacheType>): Promise<void> {
    this.logger.log('executing channel setup command');
    const serverId = command.guildId;
    const channelId = command.channelId;

    const metadata: ServerMetadata = {
      serverId,
      gameGroupChannelId: channelId,
    };

    const channel = await this.channelService.fetchChannel(channelId);
    this.logger.log('successfully fetched channel');

    if (
      !channel.isTextBased() ||
      channel.isDMBased() ||
      channel.isVoiceBased() ||
      channel.isThread()
    ) {
      this.logger.log('rejecting channel setup request: invalid channel type');
      command.reply(
        'Request failed: Game group can only use standard public text channels',
      );
    } else {
      this.logger.log(`retrieved channel ${channel.name}`);
      await this.metadataService.createOrUpdate(metadata);
      command.reply({
        content: `Set channel ${channel.name} as game group host channel`,
        ephemeral: true,
      });
    }
  }
}
