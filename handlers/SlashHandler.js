const { REST, Routes, Events } = require('discord.js');
const { ClientID, token } = require('../config.json')
const fs = require('node:fs');
const path = require('node:path');
var colors = require('colors')


module.exports = function (client) {
    
    const commands = [];

    const slashCommandPath = path.join(__dirname, '../Commands');

    client.commands = new Map();

    const commandFolder = fs.readdirSync(slashCommandPath).filter(f => f.endsWith('.js'));

    try {
    for (const file of commandFolder) {
        const filePath = path.join(slashCommandPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            const commandData = command.data.toJSON();
            const cmds = commandData.name;
            client.commands.set(commandData.name, command);
            commands.push(commandData);
            
        }
    }

} catch (err) {
    console.log(err)
}
    console.log('[ SLASH ] Started refreshing commands'.yellow)
    const rest = new REST({ version: '10' }).setToken(token);
    

    (async () => {
        try {

            await rest.put(
                Routes.applicationCommands(ClientID),
                { body: commands }
            );
            
            console.log('[ SLASH ] Refreshed Commands Succesfully'.green);
        } catch (error) {
            console.log('Error reloading application (/) commands:'.red);
        }
    })();

    client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) {
			console.log(`No command matching ${interaction.commandName} was found.`.red);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.log(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
		if(command.execute) {
			console.log(`[ SLASH ] /${interaction.commandName} has been executed by ${interaction.user.tag}`.yellow)
		}
	});
};