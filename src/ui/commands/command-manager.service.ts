import { Injectable, OnModuleInit } from '@nestjs/common';
import { CommandRegistrationService } from 'src/discord/services/command-registration/command-registration.service';
import { CommandService } from 'src/discord/services/command/command.service';
import { AddCardCommand } from './add-card/add-card.command';
import { CommandClassType } from './command.interface';
import { SetupChannelCommand } from './setup-channel/setup-channel.command';
import { SlashCommandBuilder } from 'discord.js'
import { LoggingService } from 'src/observability/services/logging/logging.service';

@Injectable()
export class CommandManagerService implements OnModuleInit {

    // manual DI for now, would be nice to leverage annotations here eventually
    private static commands: CommandClassType[] = [
        SetupChannelCommand,
        AddCardCommand,
    ]

    constructor(private commandService: CommandService,
                private commandRegistrationService: CommandRegistrationService,
                private logger: LoggingService) {}

    onModuleInit() {
        CommandManagerService.commands
            .map(commandType => new commandType())
            .forEach(command => {
                this.commandService.listenForCommand(
                    command.commandName,
                    command.run
                )
            })
    }

    async registerCommands() {
        this.logger.log('registering commands')
        const slashCommands = CommandManagerService.commands
            .map(commandType => new commandType())
            .map(command => new SlashCommandBuilder()
                .setName(command.commandName)
                .setDescription(command.description)
            )

        await this.commandRegistrationService.registerCommands(slashCommands)
        this.logger.log('commands registered')
    }

}
