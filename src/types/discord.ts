import {
	ApplicationCommandOption,
	AutocompleteInteraction,
	ButtonInteraction,
	ChatInputCommandInteraction,
	MessageContextMenuCommandInteraction,
	ModalSubmitInteraction,
	UserContextMenuCommandInteraction,
	StringSelectMenuInteraction,
	Interaction,
	Awaitable,
} from 'discord.js';

export interface RawCommand<T extends Interaction> {
	run: (interaction: T) => Awaitable<void>;
}

export interface NameCommand<T extends ChatInputCommandInteraction | MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction> extends RawCommand<T> {
	name: string;
	name_localizations?: Record<string, string>;
	default_member_permissions?: bigint;
	nsfw?: boolean;
	integration_types?: number[];
	contexts?: number[];
}

export interface IdCommand<T extends StringSelectMenuInteraction | ButtonInteraction | ModalSubmitInteraction> extends RawCommand<T> {
	custom_id: string;
}

export interface ChatInputCommand extends NameCommand<ChatInputCommandInteraction> {
	role: 'CHAT_INPUT'
	description: string;
	description_localizations?: Record<string, string>;
	options?: ApplicationCommandOption[];
	autocomplete?: (interaction: AutocompleteInteraction) => Awaitable<{ name: string, value: string | number }[]>;
}

export interface MessageContextMenuCommand extends NameCommand<MessageContextMenuCommandInteraction> {
	role: 'MESSAGE_CONTEXT_MENU';
}

export interface UserContextMenuCommand extends NameCommand<UserContextMenuCommandInteraction> {
	role: 'USER_CONTEXT_MENU';
}

export interface SelectMenuCommand extends IdCommand<StringSelectMenuInteraction> {
	role: 'SELECT_MENU';
}

export interface ButtonCommand extends IdCommand<ButtonInteraction> {
	role: 'BUTTON';
}

export interface ModalSubmit extends IdCommand<ModalSubmitInteraction> {
	role: 'MODAL_SUBMIT';
}

export type Command =
	| ChatInputCommand
	| MessageContextMenuCommand
	| UserContextMenuCommand
	| SelectMenuCommand
	| ButtonCommand
	| ModalSubmit;

export type CommandNoRun = Omit<Command, 'run'>;