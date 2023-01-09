import { AcceptedTypes } from './';
import { Dict } from '../../utils';

export interface ServerMetadata extends Dict<AcceptedTypes> {
  entityId?: string;

  serverId: string;

  gameGroupChannelId: string;
}
