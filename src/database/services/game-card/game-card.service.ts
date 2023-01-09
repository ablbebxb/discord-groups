import { FieldValue } from '@google-cloud/firestore';
import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../firestore/firestore.service';
import { CardData } from '../../models';
import { v4 as uuid } from 'uuid';

@Injectable()
export class GameCardService {
  private static COLLECTION = 'game-data';

  constructor(private firestore: FirestoreService) {}

  private getEntityId(cardId: string) {
    return `${GameCardService.COLLECTION}/${cardId}`;
  }

  async create(data: CardData): Promise<CardData> {
    if (!data.cardId) {
      data.cardId = uuid();
    }

    if (!data.entityId) {
      data.entityId = this.getEntityId(data.cardId);
    }

    const doc = await this.firestore.get(data.entityId);
    if (!(await this.firestore.exists(doc))) {
      await this.firestore.create(doc, data);
    }
    const render = await doc.get();
    return render.data() as CardData;
  }

  async update(data: CardData) {
    await this.firestore.update(data.entityId, data);
  }

  async getAll(): Promise<CardData[]> {
    const collection = await this.firestore.getAll(GameCardService.COLLECTION);
    const snapshot = await collection.get();
    return snapshot.docs.map((doc) => doc.data() as CardData);
  }

  async getByServerId(serverId: string): Promise<CardData[]> {
    const collection = await this.firestore.getAll(GameCardService.COLLECTION);
    const snapshot = await collection.where('serverId', '==', serverId).get();
    return snapshot.docs.map((doc) => doc.data() as CardData);
  }

  async getByMessageId(messageId: string): Promise<CardData> {
    const collection = await this.firestore.getAll(GameCardService.COLLECTION);
    const snapshot = await collection.where('messageId', '==', messageId).get();
    return snapshot.docs.at(0).data() as CardData;
  }

  async clearAllMessageFields(): Promise<void> {
    const collection = await this.firestore.getAll(GameCardService.COLLECTION);
    const snapshot = await collection.get();
    const deleteFieldOperation = { messageId: FieldValue.delete() };
    const deletions = snapshot.docs.map((doc) =>
      collection.doc(doc.id).update(deleteFieldOperation),
    );
    await Promise.all(deletions);
  }

  async addUserToCard(messageId: string, userId: string): Promise<void> {
    const collection = await this.firestore.getAll(GameCardService.COLLECTION);
    const snapshot = await collection.where('messageId', '==', messageId).get();
    await snapshot.docs.at(0).ref.update({
      userIds: FieldValue.arrayUnion(userId),
    });
  }

  async removeUserFromCard(messageId: string, userId: string): Promise<void> {
    const collection = await this.firestore.getAll(GameCardService.COLLECTION);
    const snapshot = await collection.where('messageId', '==', messageId).get();
    await snapshot.docs.at(0).ref.update({
      userIds: FieldValue.arrayRemove(userId),
    });
  }
}
