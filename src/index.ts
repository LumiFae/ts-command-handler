import { readdirSync } from 'fs';
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { Command } from './types/discord';
dotenv.config();

if (!process.env.TOKEN) throw new Error('You need to provide a token');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

export const commands = new Map<string, Command>();

const eventFolders = readdirSync('./src/events');
for (const folder of eventFolders) {
	switch (folder) {
	case 'discord': {
		readdirSync(`./src/events/${folder}`).forEach(
			(file) => {
				void import(`./events/${folder}/${file}`).then((event) => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
					event.default(client);
				});
			},
		);
		break;
	}
	default: {
		readdirSync(`.src/events/${folder}`).forEach(
			(file) => {
				void import(`./events/${folder}/${file}`).then((event) => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
					event.default();
				});
			},
		);
		break;
	}
	}
}

void client.login(process.env.TOKEN);
