import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { MessageReaction, User, Events } from 'discord.js';
import { GameCardService } from 'src/database/services/game-card/game-card.service';
import { RoleService } from 'src/discord/services/role/role.service';
import { LoggingService } from 'src/observability/services/logging/logging.service';
import { ComponentRootService } from 'src/ui/components/component-root.service';
import { ReactionHandler } from '../reaction.interface';

@Injectable()
export class JoinGroupService implements ReactionHandler {
  event = Events.MessageReactionAdd;

  emoji = '✋';

  constructor(
    private gameCardService: GameCardService,
    private roleService: RoleService,
    private logger: LoggingService,
    @Inject(forwardRef(() => ComponentRootService))
    private componentRootService: ComponentRootService,
  ) {}

  async handleReaction(reaction: MessageReaction, user: User) {
    const messageId = reaction.message.id;
    const serverId = reaction.message.guildId;
    const cardData = await this.gameCardService.getByMessageId(messageId);
    this.logger.log(`Adding role ${cardData.roleId} to user ${user.id}`);
    try {
      await this.roleService.grantRole(serverId, user.id, cardData.roleId);
      await this.gameCardService.addUserToCard(messageId, user.id);
      this.componentRootService.render(serverId);
    } catch (e) {
      this.logger.error(
        `Encountered error adding role ${cardData.roleId} to user ${user.id}`,
        e,
      );
    }
  }
}
