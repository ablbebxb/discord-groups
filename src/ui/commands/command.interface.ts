import { ChatInputCommandInteraction } from 'discord.js'

export type CommandClassType = { new(): Command }

export interface Command {

    commandName: string

    description: string

    run(command: ChatInputCommandInteraction): Promise<void>

}