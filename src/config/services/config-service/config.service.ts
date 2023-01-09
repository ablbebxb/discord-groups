import { Injectable } from '@nestjs/common';
import { DiscordClientServiceConfig } from 'src/discord/services/discord-client/discord-client.service';

const config = require('../../../../config.json');

@Injectable()
export class ConfigService {
  getDiscordServiceConfig(): DiscordClientServiceConfig {
    return {
      loginToken: config.discordLoginToken,
      clientId: config.discordClientId,
      guildId: config.discordGuildId,
      botUserId: config.discordBotUserId,
    };
  }
}
