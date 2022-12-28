import { Module } from '@nestjs/common';
import { ConfigService } from './services/config-service/config.service';

@Module({
  providers: [ConfigService]
})
export class ConfigModule {}
