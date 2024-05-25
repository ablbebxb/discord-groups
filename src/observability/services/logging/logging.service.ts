import { ConsoleLogger, Injectable } from '@nestjs/common';
import { createWriteStream, WriteStream, mkdirSync } from 'fs'

@Injectable()
export class LoggingService extends ConsoleLogger {

  private logStream: WriteStream

  constructor() {
    super()
    this.logStream = createWriteStream('/app/logs/out.log', { flags: 'w' })
  }

  log(message: string) {
    console.log(message)
    this.logStream.write(message + '\n')
  }

  error(message: any, stack?: string, context?: string) {
    console.error(message, stack);
    this.logStream.write(message + '\n')
    this.logStream.write(stack + '\n')
  }
}
