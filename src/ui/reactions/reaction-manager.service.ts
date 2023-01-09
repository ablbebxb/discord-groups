import { Injectable, OnModuleInit } from '@nestjs/common';
import { ReactionService } from 'src/discord/services/reaction/reaction.service';
import { JoinGroupService } from './join-group/join-group.service';
import { ReactionHandler } from './reaction.interface';
import { filter } from 'rxjs';
import { LoggingService } from 'src/observability/services/logging/logging.service';
import { GameCardService } from 'src/database/services/game-card/game-card.service';
import { LeaveGroupService } from './leave-group/leave-group.service';

@Injectable()
export class ReactionManagerService implements OnModuleInit {
  private messageIds: string[];

  private reactionHandlers: ReactionHandler[];

  constructor(
    private reactionService: ReactionService,
    private joinGroup: JoinGroupService,
    private leaveGroup: LeaveGroupService,
    private gameCardService: GameCardService,
    private logger: LoggingService,
  ) {
    this.reactionHandlers = [this.joinGroup, this.leaveGroup];
  }

  async onModuleInit() {
    await this.refreshMessageIds();

    const reactionPipe = this.reactionService
      .listenForReactions()
      .pipe(
        filter((reactionTuple) =>
          this.messageIds.includes(reactionTuple[0].message.id),
        ),
      );

    this.reactionHandlers.forEach((handler) => {
      reactionPipe
        .pipe(
          filter((reactionTuple) => reactionTuple[2] === handler.event),
          filter(
            (reactionTuple) => reactionTuple[0].emoji.name === handler.emoji,
          ),
        )
        .subscribe(async (reactionTuple) => {
          const reaction = reactionTuple[0];
          const emoji = reactionTuple[0].emoji.name;
          const user = reactionTuple[1];
          this.logger.log(
            `handling reaction ${emoji} on message ${reaction.message.id} from user ${user.id}`,
          );
          try {
            await handler.handleReaction(reaction, user);
          } catch (e) {
            this.logger.error(
              `Encountered error while handling reaction ${emoji} on message ${reaction.message.id} from user ${user.id}`,
              e,
            );
          }
        });
    });
  }

  async refreshMessageIds() {
    const cards = await this.gameCardService.getAll();
    this.messageIds = cards.map((card) => card.messageId);
  }
}
