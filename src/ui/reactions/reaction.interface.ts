import { MessageReaction, User, Events } from 'discord.js';

export interface ReactionHandler {
  event: Events;

  emoji: string;

  handleReaction(reaction: MessageReaction, user: User): Promise<void>;
}
