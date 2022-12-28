import { Test, TestingModule } from '@nestjs/testing';
import { CommandRegistrationService } from './command-registration.service';

describe('CommandRegistrationService', () => {
  let service: CommandRegistrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommandRegistrationService],
    }).compile();

    service = module.get<CommandRegistrationService>(CommandRegistrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
