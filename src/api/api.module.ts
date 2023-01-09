import { Module } from '@nestjs/common';
import { UiModule } from 'src/ui/ui.module';
import { ManagementController } from './management/management.controller';

@Module({
  controllers: [ManagementController],
  imports: [UiModule],
})
export class ApiModule {}
