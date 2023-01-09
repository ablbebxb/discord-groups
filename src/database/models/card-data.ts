import { AcceptedTypes } from './';
import { Dict } from '../../utils';

export interface CardData extends Dict<AcceptedTypes> {
  entityId?: string;

  messageId?: string;

  cardId?: string;

  serverId: string;

  userIds: string[];

  roleTag: string;

  roleId: string;

  gameImageSrc: string;

  description: string;

  title: string;
}
