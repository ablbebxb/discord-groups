import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ChannelManager,
  Channel,
  Message,
  MessagePayload,
  MessageEditOptions,
} from 'discord.js';
import { LoggingService } from 'src/observability/services/logging/logging.service';
import { DiscordClientService } from '../discord-client/discord-client.service';

@Injectable()
export class ChannelService implements OnModuleInit {
  private channelManager: ChannelManager;

  constructor(
    private discordService: DiscordClientService,
    private loggingService: LoggingService,
  ) {}

  async onModuleInit() {
    this.channelManager = await this.discordService.getChannelManager();
  }

  async fetchChannel(id: string) {
    return await this.channelManager.fetch(id);
  }

  async getMessage(channel: Channel, messageId: string) {
    if (channel.isTextBased()) {
      return await channel.messages.fetch(messageId);
    } else {
      this.loggingService.error('Tried to fetch message on non text channel');
      throw Error('Tried to fetch message on non text channel');
    }
  }

  async createMessage(channel: Channel) {
    if (channel.isTextBased()) {
      return await channel.send('placeholder');
    } else {
      this.loggingService.error('Tried to create message on non text channel');
      throw Error('Tried to create message on non text channel');
    }
  }

  async updateMessage(
    message: Message,
    content: string | MessagePayload | MessageEditOptions,
  ) {
    await message.edit(content);
  }

  async pruneAllOwnedMessages(channel: Channel) {
    if (channel.isTextBased()) {
      this.loggingService.log('fetching messages');
      const messages = await channel.messages.fetch();
      this.loggingService.log(`fetched messages ${messages.size}`);
      const userId = this.discordService.getBotUserId();
      this.loggingService.log(`user id ${userId}`);

      for (let i = 0; i < messages.size; i++) {
        const message = messages.at(i);
        this.loggingService.log(`message user id: ${message.author.id}`);
        if (message.author.id === userId) {
          await message.delete();
        }
      }
    } else {
      this.loggingService.error(
        'Tried to prune all message on non text channel',
      );
      throw Error('Tried to prune all message on non text channel');
    }
  }
}
