module.exports = {
    name: 'poke',
    async execute(message, client) {
        const button = {
            type: 1,
            components: [
                {
                    type: 2,
                    custom_id: 'poke',
                    label: 'Poke',
                    style: 1
                }
            ]
        }

        await message.reply({ content: 'hello', components: [button] })
    }
}