import { Module, Global } from '@nestjs/common';
import { LoggingService } from './services/logging/logging.service';

@Global()
@Module({
  providers: [LoggingService],
  exports: [LoggingService],
})
export class ObservabilityModule {}
