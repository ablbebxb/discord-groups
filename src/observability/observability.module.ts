import { Module } from '@nestjs/common';
import { LoggingService } from './services/logging/logging.service';

@Module({
  providers: [LoggingService]
})
export class ObservabilityModule {}
