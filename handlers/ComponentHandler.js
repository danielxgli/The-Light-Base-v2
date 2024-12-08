const fs = require('node:fs');
const path = require('node:path');
const colors = require('colors');
const { Events } = require('discord.js');

module.exports = function (client) {
    client.components = new Map();

    const componentsPath = path.join(__dirname, '../Components');
    const subFolders = fs.readdirSync(componentsPath).filter(file => fs.statSync(path.join(componentsPath, file)).isDirectory());

    for (const folder of subFolders) {
        const folderPath = path.join(componentsPath, folder);
        const componentsFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

        for (const file of componentsFiles) {
            const component = require(path.join(folderPath, file));

            if (!component.customID) {
                console.warn(`The component at ${path.join(folderPath, file)} is missing a required "customID" property.`.yellow);
                continue;
            }

            if (!component.execute) {
                console.warn(`The component at ${path.join(folderPath, file)} is missing a required "execute" property.`.yellow);
                continue;
            }

            client.components.set(component.customID, component);
        }
    }

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isButton() && !interaction.isAnySelectMenu() && !interaction.isModalSubmit()) return;

        const component = client.components.get(interaction.customId); // Use customId instead of customID
        if (!component) {
            console.warn(`No component found for customId: ${interaction.customId}`.yellow);
            return;
        }

        try {
            await component.execute(interaction, client);
            console.log(`[ COMPONENT ] ${interaction.customId} has been executed by ${interaction.user.tag}`.yellow);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'There was an error while executing this component!',
                ephemeral: true
            });
        }
    });
}