import { Controller, Get } from '@nestjs/common';
import { get } from 'http';
import { LoggingService } from 'src/observability/services/logging/logging.service';
import { CommandManagerService } from 'src/ui/commands/command-manager.service';

@Controller('v1/management')
export class ManagementController {

    constructor(private commandManager: CommandManagerService,
                private logger: LoggingService) {}

    @Get('/register-commands')
    async registerCommands() {
        this.logger.log('recieved request to register commands')
        try {
            await this.commandManager.registerCommands()
        } catch(e) {
            this.logger.error('Encountered error handling request to register commands')
            throw e
        }
        this.logger.log('successfully handled request to register commands')
    }

}
