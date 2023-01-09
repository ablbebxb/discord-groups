import { Module } from '@nestjs/common';
import { FirestoreService } from './services/firestore/firestore.service';
import { GameCardService } from './services/game-card/game-card.service';
import { MetadataService } from './services/metadata/metadata.service';

@Module({
  providers: [FirestoreService, GameCardService, MetadataService],
  exports: [GameCardService, MetadataService],
})
export class DatabaseModule {}
