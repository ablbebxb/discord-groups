import { Module } from '@nestjs/common';
import { GameCardService } from './components/game-card/game-card.service';
import { GameChannelService } from './components/game-channel/game-channel.service';
import { CommandManagerService } from './commands/command-manager.service';

@Module({
  providers: [
    GameCardService,
    GameChannelService,
    CommandManagerService
  ]
})
export class UiModule {}
