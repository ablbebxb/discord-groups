import { Controller, Get, Param } from '@nestjs/common';
import { LoggingService } from 'src/observability/services/logging/logging.service';
import { CommandManagerService } from 'src/ui/commands/command-manager.service';
import { ComponentRootService } from 'src/ui/components/component-root.service';

@Controller('v1/management')
export class ManagementController {
  constructor(
    private commandManager: CommandManagerService,
    private componentRootService: ComponentRootService,
    private logger: LoggingService,
  ) {}

  @Get('/register-commands')
  async registerCommands() {
    this.logger.log('recieved request to register commands');
    try {
      await this.commandManager.registerCommands();
    } catch (e) {
      this.logger.error(
        'Encountered error handling request to register commands',
      );
      throw e;
    }
    this.logger.log('successfully handled request to register commands');
  }

  @Get('/prune-ui/:serverId')
  async pruneUi(@Param() params) {
    const serverId = params.serverId;
    this.logger.log(`recieved request to prune on server ${serverId}`);
    try {
      await this.componentRootService.prune(serverId);
    } catch (e) {
      this.logger.error('Encountered error handling request to prune');
      throw e;
    }
    this.logger.log('successfully handled request to prune');
  }

  @Get('/refresh-ui/:serverId')
  async refreshUi(@Param() params) {
    const serverId = params.serverId;
    this.logger.log(`recieved request to render on server ${serverId}`);
    try {
      await this.componentRootService.render(serverId);
    } catch (e) {
      this.logger.error('Encountered error handling request to render');
      throw e;
    }
    this.logger.log('successfully handled request to render');
  }
}
