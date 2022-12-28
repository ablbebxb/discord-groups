import { Module } from '@nestjs/common';
import { FirestoreService } from './services/firestore/firestore.service';
import { GameCardService } from './services/game-card/game-card.service';

@Module({
  providers: [FirestoreService, GameCardService]
})
export class DatabaseModule {}
