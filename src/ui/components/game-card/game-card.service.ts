import { Injectable } from '@nestjs/common';
import { EmbedBuilder, Message } from 'discord.js';
import { ChannelService } from 'src/discord/services/channel/channel.service';
import { UserService } from 'src/discord/services/user/user.service';
import { CardData } from '../../../database/models';

@Injectable()
export class GameCardService {
  private static SIDEBAR_COLOR = 0x0099ff;

  constructor(
    private channelService: ChannelService,
    private userService: UserService,
  ) {}

  async render(message: Message, cardData: CardData): Promise<void> {
    const userData = await Promise.all(
      cardData.userIds.map((id) => this.userService.getUser(id)),
    );

    let userTags = userData.map((user) => user.tag).join(' ');

    if (cardData.userIds.length === 0) {
      userTags = 'No users added yet';
    }

    console.log(cardData);
    console.log(userTags);

    const embed = new EmbedBuilder()
      .setColor(GameCardService.SIDEBAR_COLOR)
      .setTitle(cardData.title)
      .setDescription(cardData.description)
      .addFields(
        { name: 'Group Tag', value: cardData.roleTag },
        { name: 'Members', value: userTags },
      );

    await this.channelService.updateMessage(message, {
      embeds: [embed],
      content: '',
    });
  }
}
