import { ChatInputCommandInteraction, CacheType } from 'discord.js';
import { Command } from '../command.interface';

export class SetupChannelCommand implements Command {

    commandName: string = 'setupChannel'

    description = 'initialize a channel for the bot to manage'

    run(command: ChatInputCommandInteraction<CacheType>): Promise<void> {
        throw new Error('Method not implemented.');
    }

}
