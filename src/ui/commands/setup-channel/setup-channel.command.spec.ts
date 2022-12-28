import { Test, TestingModule } from '@nestjs/testing';
import { SetupChannelCommand } from './setup-channel.command';

describe('SetupChannelService', () => {
  let service: SetupChannelCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SetupChannelCommand],
    }).compile();

    service = module.get<SetupChannelCommand>(SetupChannelCommand);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
