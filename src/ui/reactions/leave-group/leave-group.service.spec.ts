import { Test, TestingModule } from '@nestjs/testing';
import { LeaveGroupService } from './leave-group.service';

describe('LeaveGroupService', () => {
  let service: LeaveGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveGroupService],
    }).compile();

    service = module.get<LeaveGroupService>(LeaveGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
