import { Injectable } from '@nestjs/common';
import { CardData } from 'src/database/models';
import { ChannelService } from 'src/discord/services/channel/channel.service';
import { GameCardService } from '../game-card/game-card.service';
import { GameCardService as GameCardDataService } from '../../../database/services/game-card/game-card.service';

@Injectable()
export class GameChannelService {
  constructor(
    private gameCardService: GameCardService,
    private gameCardDataService: GameCardDataService,
    private channelService: ChannelService,
  ) {}

  async render(channelId: string, cards: CardData[]) {
    const channel = await this.channelService.fetchChannel(channelId);

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (!card.messageId) {
        const message = await this.channelService.createMessage(channel);
        card.messageId = message.id;

        // This is horrid :(, need to figure out how to avoid doing a
        // db write-back here without loosing the ability to jetisson
        // and rebuild the ui if needed
        await this.gameCardDataService.update(card);
      }

      const message = await this.channelService.getMessage(
        channel,
        card.messageId,
      );
      await this.gameCardService.render(message, card);
    }
  }
}
