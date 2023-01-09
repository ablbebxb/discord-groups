import { Test, TestingModule } from '@nestjs/testing';
import { ComponentRootService } from './component-root.service';

describe('ComponentRootService', () => {
  let service: ComponentRootService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComponentRootService],
    }).compile();

    service = module.get<ComponentRootService>(ComponentRootService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
