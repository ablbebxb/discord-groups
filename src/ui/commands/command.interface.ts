import {
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
} from 'discord.js';

export type CommandClassType = { new (...services: any[]): Command };

export interface Command {
  commandName: string;

  description: string;

  run(command: ChatInputCommandInteraction): Promise<void>;
}

export interface ModalHandler {
  modalId: string;

  handleModalSubmit(command: ModalSubmitInteraction): Promise<void>;
}
