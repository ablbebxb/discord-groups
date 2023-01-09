import { Test, TestingModule } from '@nestjs/testing';
import { JoinGroupService } from './join-group.service';

describe('JoinGroupService', () => {
  let service: JoinGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JoinGroupService],
    }).compile();

    service = module.get<JoinGroupService>(JoinGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
