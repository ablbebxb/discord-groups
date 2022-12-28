import { Test, TestingModule } from '@nestjs/testing';
import { GameChannelService } from './game-channel.service';

describe('GameChannelService', () => {
  let service: GameChannelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameChannelService],
    }).compile();

    service = module.get<GameChannelService>(GameChannelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
