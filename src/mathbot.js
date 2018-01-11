'use strict'

let DiscordBot = require('./discordbot.js')

class MathBot extends DiscordBot {
  constructor (options) {
    super(options)
    this.client.on('message', this.onMessage.bind(this))
  }

  onMessage (message) {
    console.log('Message from ' + message.author.tag + ': ' + message.cleanContent);
    if (this.isOwner(message.author) && message.cleanContent.toLowerCase() === 'stop') {
      this.stop()
    }
  }
}

module.exports = MathBot
