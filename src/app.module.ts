import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { DiscordModule } from './discord/discord.module';
import { UiModule } from './ui/ui.module';
import { ConfigModule } from './config/config.module';
import { ObservabilityModule } from './observability/observability.module';

@Module({
  imports: [DatabaseModule, DiscordModule, UiModule, ConfigModule, ObservabilityModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
