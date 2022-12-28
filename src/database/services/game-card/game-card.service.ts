import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../firestore/firestore.service';
import { CardData } from '../../models'

@Injectable()
export class GameCardService {

    constructor(private firestore: FirestoreService) {}

    private async create(data: CardData) {
        const doc = await this.firestore.get(data.entityId)
        if (!(await this.firestore.exists(doc))) {
            await this.firestore.create(doc, data)
        }
        return doc
    }

}
