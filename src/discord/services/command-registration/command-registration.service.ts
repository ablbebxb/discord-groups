import { Injectable } from '@nestjs/common';
import { DiscordClientService } from '../discord-client/discord-client.service';
import { SlashCommandBuilder, Routes } from 'discord.js';

@Injectable()
export class CommandRegistrationService {
  constructor(private discordService: DiscordClientService) {}

  // This is a rate-limited call.
  async registerCommands(commands: SlashCommandBuilder[]) {
    const commandData = commands.map((command) => command.toJSON());
    const clientId = this.discordService.getClientId();
    const guildId = this.discordService.getGuildId();
    const route = Routes.applicationGuildCommands(clientId, guildId);
    await this.discordService.sendRestCall(route, { body: commandData });
  }
}
