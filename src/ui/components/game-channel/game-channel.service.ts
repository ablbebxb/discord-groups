import { Injectable } from '@nestjs/common';
import { CardData } from 'src/database/models';
import { GameCardService } from '../game-card/game-card.service';

@Injectable()
export class GameChannelService {

    constructor(private gameCardService: GameCardService) {}
    
    render(channelId: string, cards: CardData[]) {
        cards
            .map(card => ({
                embed: this.gameCardService.render(card),
                messageId: card.messageId,
            }))
            .forEach(embedDetails => {
                
            })
    }

}
