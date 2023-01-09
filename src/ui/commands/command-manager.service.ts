import { Injectable, OnModuleInit } from '@nestjs/common';
import { CommandRegistrationService } from 'src/discord/services/command-registration/command-registration.service';
import { CommandService } from 'src/discord/services/command/command.service';
import { AddCardCommand } from './add-card/add-card.command';
import { Command, ModalHandler } from './command.interface';
import { SetupChannelCommand } from './setup-channel/setup-channel.command';
import { SlashCommandBuilder } from 'discord.js';
import { LoggingService } from 'src/observability/services/logging/logging.service';

@Injectable()
export class CommandManagerService implements OnModuleInit {
  private commands: Command[];

  private modalCommands: ModalHandler[];

  constructor(
    private commandService: CommandService,
    private commandRegistrationService: CommandRegistrationService,
    private logger: LoggingService,
    private setupChannelCommand: SetupChannelCommand,
    private addCardCommand: AddCardCommand,
  ) {
    // would be nice to handle this with custom annotations eventually
    this.commands = [this.setupChannelCommand, this.addCardCommand];

    this.modalCommands = [this.addCardCommand];
  }

  onModuleInit() {
    this.commands.forEach((command) => {
      this.commandService.listenForCommand(
        command.commandName,
        command.run.bind(command),
      );
    });

    this.modalCommands.forEach((command) => {
      this.commandService.listenForModal(
        command.modalId,
        command.handleModalSubmit.bind(command),
      );
    });
  }

  async registerCommands() {
    this.logger.log('registering commands');
    const slashCommands = this.commands
      .map((command) => {
        this.logger.log(
          `creating command: ${command.commandName}...${command.description}`,
        );
        return command;
      })
      .map((command) =>
        new SlashCommandBuilder()
          .setName(command.commandName)
          .setDescription(command.description),
      );

    await this.commandRegistrationService.registerCommands(slashCommands);
    this.logger.log('commands registered');
  }
}
