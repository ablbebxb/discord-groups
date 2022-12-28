import { Injectable, OnModuleInit } from '@nestjs/common';
import { ChannelManager, Channel } from 'discord.js';
import { LoggingService } from 'src/observability/services/logging/logging.service';
import { DiscordClientService } from '../discord-client/discord-client.service';

@Injectable()
export class ChannelService implements OnModuleInit {

    private channelManager: ChannelManager

    constructor(private discordService: DiscordClientService,
                private loggingService: LoggingService) {}

    async onModuleInit() {
        this.channelManager = await this.discordService.getChannelManager()
    }

    async fetchChannel(id: string) {
        return await this.channelManager.fetch(id)
    }

    async getMessage(channel: Channel, messageId: string) {
        if(channel.isTextBased()) {
            return await channel.messages.fetch(messageId)
        } else {
            this.loggingService.error('Tried to fetch message on text channel')
            throw Error('Tried to fetch message on text channel')
        }
    }

}
