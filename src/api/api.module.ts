import { Module } from '@nestjs/common';
import { ManagementController } from './management/management.controller';

@Module({
  controllers: [ManagementController]
})
export class ApiModule {}
