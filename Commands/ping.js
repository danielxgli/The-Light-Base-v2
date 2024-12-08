const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder,  } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong'),
    async execute(interaction, client) {
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
			.setCustomId('poke')
			.setLabel('Confirm Ban')
			.setStyle('Primary')
        )

        await interaction.reply({ content: 'Hello', components: [row] })
    }
}