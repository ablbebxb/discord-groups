import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserManager } from 'discord.js';
import { DiscordClientService } from '../discord-client/discord-client.service';

@Injectable()
export class UserService implements OnModuleInit {
  private userManager: UserManager;

  constructor(private discordService: DiscordClientService) {}

  async onModuleInit() {
    this.userManager = await this.discordService.getUserManager();
  }

  async getUser(userId: string) {
    return await this.userManager.fetch(userId);
  }
}
