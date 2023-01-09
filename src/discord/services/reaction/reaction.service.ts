import { Injectable } from '@nestjs/common';
import { LoggingService } from 'src/observability/services/logging/logging.service';
import { DiscordClientService } from '../discord-client/discord-client.service';
import { MessageReaction, User } from 'discord.js';
import { tap } from 'rxjs';

@Injectable()
export class ReactionService {
  constructor(
    private discordService: DiscordClientService,
    private logger: LoggingService,
  ) {}

  listenForReactions() {
    return this.discordService.getReactionStream();
  }
}
