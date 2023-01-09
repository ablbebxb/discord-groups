import { Injectable } from '@nestjs/common';
import { ServerMetadata } from 'src/database/models/metadata';
import { FirestoreService } from '../firestore/firestore.service';

@Injectable()
export class MetadataService {
  private static COLLECTION = 'server-metadata';

  constructor(private firestore: FirestoreService) {}

  private getEntityId(serverId: string) {
    return `${MetadataService.COLLECTION}/${serverId}`;
  }

  async createOrUpdate(data: ServerMetadata) {
    if (!data.entityId) {
      data.entityId = this.getEntityId(data.serverId);
    }

    const doc = await this.firestore.get(data.entityId);
    if (!(await this.firestore.exists(doc))) {
      await this.firestore.create(doc, data);
    } else {
      await this.firestore.update(doc, data);
    }
    return doc;
  }

  async getMetadata(serverId: string): Promise<ServerMetadata> {
    const entityId = this.getEntityId(serverId);
    const doc = await this.firestore.get(entityId);
    if (!(await this.firestore.exists(doc))) {
      return null;
    }
    const snapshot = await doc.get();
    return snapshot.data() as ServerMetadata;
  }

  async getAll(): Promise<ServerMetadata[]> {
    const collection = await this.firestore.getAll(MetadataService.COLLECTION);
    const snapshot = await collection.get();
    return snapshot.docs.map((doc) => doc.data() as ServerMetadata);
  }
}
