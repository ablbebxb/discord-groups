import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { GameCardService } from './components/game-card/game-card.service';
import { GameChannelService } from './components/game-channel/game-channel.service';
import { CommandManagerService } from './commands/command-manager.service';
import { DiscordModule } from 'src/discord/discord.module';
import { DatabaseModule } from 'src/database/database.module';
import { AddCardCommand } from './commands/add-card/add-card.command';
import { SetupChannelCommand } from './commands/setup-channel/setup-channel.command';
import { ComponentRootService } from './components/component-root.service';
import { ReactionManagerService } from './reactions/reaction-manager.service';
import { JoinGroupService } from './reactions/join-group/join-group.service';
import { LeaveGroupService } from './reactions/leave-group/leave-group.service';

@Module({
  providers: [
    GameCardService,
    GameChannelService,
    CommandManagerService,
    AddCardCommand,
    SetupChannelCommand,
    ComponentRootService,
    ReactionManagerService,
    JoinGroupService,
    LeaveGroupService,
  ],
  imports: [DiscordModule, DatabaseModule, ScheduleModule.forRoot()],
  exports: [CommandManagerService, ComponentRootService],
})
export class UiModule {}
