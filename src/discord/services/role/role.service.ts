import { Injectable } from '@nestjs/common';
import { DiscordClientService } from '../discord-client/discord-client.service';

@Injectable()
export class RoleService {
  constructor(private discordService: DiscordClientService) {}

  async createRole(serverId: string, roleName: string) {
    const roleManager = await this.discordService.getRoleManager(serverId);
    const role = await roleManager.create({ name: roleName, permissions: [] });
    return role.id;
  }

  async deleteRole(serverId: string, roleId: string) {
    const roleManager = await this.discordService.getRoleManager(serverId);
    const role = await roleManager.delete(roleId);
  }

  async grantRole(serverId: string, userId: string, roleId: string) {
    const memberManager = await this.discordService.getMemberManager(serverId);
    const user = await memberManager.fetch(userId);
    await user.roles.add(roleId);
  }

  async removeRole(serverId: string, userId: string, roleId: string) {
    const memberManager = await this.discordService.getMemberManager(serverId);
    const user = await memberManager.fetch(userId);
    await user.roles.remove(roleId);
  }
}
