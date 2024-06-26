import {
  Firestore,
  DocumentReference,
  CollectionReference,
} from '@google-cloud/firestore';
import { Injectable } from '@nestjs/common';

import { Dict, waitForCondition } from '../../../utils';
import { AcceptedTypes } from '../../models/accepted-types';

@Injectable()
export class FirestoreService {
  private db: Firestore;

  constructor() {
    this.db = new Firestore({
      keyFilename: '/app/nest-bot/key.json',
    });
  }

  async get(id: string): Promise<DocumentReference> {
    return this.db.doc(id);
  }

  async getAll(collection: string): Promise<CollectionReference> {
    return this.db.collection(collection);
  }

  async interpolateDoc(
    doc: DocumentReference | string,
  ): Promise<DocumentReference> {
    if (typeof doc === 'string') {
      doc = await this.get(doc);
    }

    return doc;
  }

  async exists(id: string): Promise<boolean>;
  async exists(doc: DocumentReference): Promise<boolean>;
  async exists(doc: DocumentReference | string): Promise<boolean> {
    doc = await this.interpolateDoc(doc);
    return (await doc.get()).exists;
  }

  async create(id: string, kvp: Dict<AcceptedTypes>): Promise<void>;
  async create(doc: DocumentReference, kvp: Dict<AcceptedTypes>): Promise<void>;
  async create(
    doc: DocumentReference | string,
    kvp: Dict<AcceptedTypes>,
  ): Promise<void> {
    const interpolatedDoc = await this.interpolateDoc(doc);
    await interpolatedDoc.create(kvp);
    await waitForCondition(async () => {
      const snapshot = await interpolatedDoc.get()
      const data = await snapshot.data()
      return data != undefined
    })
  }

  async update(id: string, kvp: Dict<AcceptedTypes>): Promise<void>;
  async update(doc: DocumentReference, kvp: Dict<AcceptedTypes>): Promise<void>;
  async update(
    doc: DocumentReference | string,
    kvp: Dict<AcceptedTypes>,
  ): Promise<void> {
    doc = await this.interpolateDoc(doc);
    doc.update(kvp);
  }

  async set(id: string, kvp: Dict<AcceptedTypes>): Promise<void>;
  async set(doc: DocumentReference, kvp: Dict<AcceptedTypes>): Promise<void>;
  async set(
    doc: DocumentReference | string,
    kvp: Dict<AcceptedTypes>,
  ): Promise<void> {
    doc = await this.interpolateDoc(doc);
    doc.set(kvp);
  }

  async delete(id: string): Promise<void>;
  async delete(doc: DocumentReference): Promise<void>;
  async delete(doc: DocumentReference | string): Promise<void> {
    doc = await this.interpolateDoc(doc);
    doc.delete();
  }
}
