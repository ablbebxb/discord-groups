import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GameCardService } from 'src/database/services/game-card/game-card.service';
import { MetadataService } from 'src/database/services/metadata/metadata.service';
import { ChannelService } from 'src/discord/services/channel/channel.service';
import { LoggingService } from 'src/observability/services/logging/logging.service';
import { ReactionManagerService } from '../reactions/reaction-manager.service';
import { GameChannelService } from './game-channel/game-channel.service';

@Injectable()
export class ComponentRootService {
  constructor(
    private gameCardService: GameCardService,
    private gameChannelService: GameChannelService,
    private metadataService: MetadataService,
    private channelService: ChannelService,
    private reactionService: ReactionManagerService,
    private logger: LoggingService,
  ) {}

  @Cron('*/5 * * * *')
  async regularRefresh() {
    await this.refreshAll();
  }

  async refreshAll() {
    const serverData = await this.metadataService.getAll();
    const updates = serverData.map((server) => this.render(server.serverId));
    await Promise.all(updates);
  }

  async render(serverId: string) {
    this.logger.log(`Refreshing server ${serverId}`)
    const cards = await this.gameCardService.getByServerId(serverId);
    this.logger.log(`Cards to render ${cards.length}`)
    const metadata = await this.metadataService.getMetadata(serverId);
    await this.gameChannelService.render(metadata.gameGroupChannelId, cards);
    await this.reactionService.refreshMessageIds();
  }

  async prune(serverId: string) {
    this.logger.log('pruning server');
    const metadata = await this.metadataService.getMetadata(serverId);
    const channel = await this.channelService.fetchChannel(
      metadata.gameGroupChannelId,
    );
    await this.channelService.pruneAllOwnedMessages(channel);
    this.logger.log('pruned ui');
    await this.gameCardService.clearAllMessageFields();
    this.logger.log('pruned data');
  }
}
