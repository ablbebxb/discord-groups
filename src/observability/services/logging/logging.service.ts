import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggingService {
  log(message: string) {
    console.log(message);
  }

  error(message: string, e?: Error) {
    console.error(message, e);
  }
}
