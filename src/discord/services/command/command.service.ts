import { Injectable } from '@nestjs/common';
import { DiscordClientService } from '../discord-client/discord-client.service';
import {
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
} from 'discord.js';
import { filter } from 'rxjs';
import { LoggingService } from 'src/observability/services/logging/logging.service';

@Injectable()
export class CommandService {
  constructor(
    private discordService: DiscordClientService,
    private logger: LoggingService,
  ) {}

  listenForCommand(
    commandName: string,
    behavior: (e: ChatInputCommandInteraction) => Promise<void>,
  ) {
    this.discordService
      .getCommandStream()
      .pipe(filter((command) => command.commandName === commandName))
      .subscribe(async (command) => {
        this.logger.log(`handling command ${command.commandName}`);
        try {
          await behavior(command);
        } catch (e) {
          this.logger.error(
            `Encountered error while handling behavior for command ${commandName}`,
            e,
          );
        }
      });
  }

  listenForModal(
    modalName: string,
    behavior: (e: ModalSubmitInteraction) => Promise<void>,
  ) {
    this.discordService
      .getModalStream()
      .pipe(filter((command) => command.customId === modalName))
      .subscribe(async (command) => {
        this.logger.log(`handling modal ${command.customId}`);
        try {
          await behavior(command);
        } catch (e) {
          this.logger.error(
            `Encountered error while handling modal ${modalName}`,
            e,
          );
        }
      });
  }
}
