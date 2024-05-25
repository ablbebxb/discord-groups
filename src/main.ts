import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingService } from './observability/services/logging/logging.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(LoggingService))
  await app.listen(3000);
}
bootstrap();
