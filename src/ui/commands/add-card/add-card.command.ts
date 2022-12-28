import { ChatInputCommandInteraction, CacheType } from 'discord.js';
import { Command } from '../command.interface';

export class AddCardCommand implements Command {

    commandName: string = 'addGame'

    description = 'Add a game card to the channel'

    run(command: ChatInputCommandInteraction<CacheType>): Promise<void> {
        throw new Error('Method not implemented.');
    }

}
