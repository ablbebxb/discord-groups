import { Injectable } from '@nestjs/common';
import { DiscordClientServiceConfig } from 'src/discord/services/discord-client/discord-client.service';

@Injectable()
export class ConfigService {

    getDiscordServiceConfig(): DiscordClientServiceConfig {
        return {
            loginToken: 'dummy',
            clientId: 'dummy',
            guildId: 'dummy'
        }
    }

}
