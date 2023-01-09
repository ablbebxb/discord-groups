import { Test, TestingModule } from '@nestjs/testing';
import { ReactionManagerService } from './reaction-manager.service';

describe('ReactionManagerService', () => {
  let service: ReactionManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReactionManagerService],
    }).compile();

    service = module.get<ReactionManagerService>(ReactionManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
