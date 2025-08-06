import { Client, Interaction } from 'discord.js';
import { commands } from '../..';

export default function(client: Client) {
	client.on('interactionCreate', async (interaction) => {
		let finder: string;
		if (!('commandName' in interaction)) {
			finder = interaction.customId;
		}
		else {
			finder = interaction.commandName;
		}
		const command = commands.get(finder);
		if (!command) return;
		console.log(`Executing interaction ${finder}...`);
		try {
			if (interaction.isAutocomplete() && 'autocomplete' in command) {
				await command.autocomplete?.(interaction);
			}
			else {
				await (command.run as (interaction: Interaction) => unknown)(
					interaction,
				);
			}
			console.log(`Interaction ${finder} executed successfully!`);
		}
		catch (error) {
			console.error(`Error while executing interaction ${finder}:`, error);
			if (interaction.isCommand()) {
				if (interaction.deferred || interaction.replied) {
					await interaction.editReply({
						content:
                            'There was an error while executing this command!',
					});
				}
				else {
					await interaction.reply({
						content:
                            'There was an error while executing this command!',
						ephemeral: true,
					});
				}
			}
		}
	});
}
