import { Module } from '@nestjs/common';
import { DiscordClientService } from './services/discord-client/discord-client.service';
import { MessageService } from './services/message/message.service';
import { ChannelService } from './services/channel/channel.service';
import { CommandService } from './services/command/command.service';
import { CommandRegistrationService } from './services/command-registration/command-registration.service';

@Module({
  providers: [DiscordClientService, MessageService, ChannelService, CommandService, CommandRegistrationService]
})
export class DiscordModule {}
