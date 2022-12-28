import { Injectable } from '@nestjs/common';
import { EmbedBuilder } from 'discord.js';
import { CardData } from '../../../database/models';

@Injectable()
export class GameCardService {

    private static SIDEBAR_COLOR = 0x0099FF

    async render(cardData: CardData): Promise<EmbedBuilder> {
        return new EmbedBuilder()
            .setColor(GameCardService.SIDEBAR_COLOR)
            .setTitle(cardData.title)
            .setDescription(cardData.description)
            .addFields(
                { name: 'Group Tag', value: cardData.roleTag },
                { name: 'Members', value: cardData.userTags.join(' ') },
            )
            .setImage(cardData.gameImageSrc)
    }

}
