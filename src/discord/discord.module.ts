import { Module } from '@nestjs/common';
import { DiscordClientService } from './services/discord-client/discord-client.service';
import { ChannelService } from './services/channel/channel.service';
import { CommandService } from './services/command/command.service';
import { CommandRegistrationService } from './services/command-registration/command-registration.service';
import { RoleService } from './services/role/role.service';
import { ReactionService } from './services/reaction/reaction.service';
import { UserService } from './services/user/user.service';

@Module({
  providers: [
    DiscordClientService,
    ChannelService,
    CommandService,
    CommandRegistrationService,
    RoleService,
    ReactionService,
    UserService,
  ],
  exports: [
    ChannelService,
    CommandService,
    CommandRegistrationService,
    RoleService,
    ReactionService,
    UserService,
  ],
})
export class DiscordModule {}
