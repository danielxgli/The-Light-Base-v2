const fs = require('node:fs')
const path = require('node:path')
const colors = require('colors')


module.exports = function (client) {
    const eventFolder = path.join(__dirname, '../events')
    const eventFiles = fs.readdirSync(eventFolder).filter(f => f.endsWith('.js'))
    console.log(`Loaded ${eventFiles.length} File(s)`.green)

    for (const file of eventFiles) {
        const filePath = path.join('../events', file)
        const event = require(filePath)

        if(event.once) {
            client.once(event.name, (...args) => event.execute(...args, client))
        } else {
            client.on(event.name, (...args) => event.execute(...args, client))
        }
    }
}