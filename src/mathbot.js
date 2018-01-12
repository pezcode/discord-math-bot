'use strict'

let DiscordBot = require('./discordbot.js')

class MathBot extends DiscordBot {
  constructor (options) {
    super(options)

    Object.assign(this.commands, {
      // no additional commands
    })

    Object.assign(this.adminCommands, {
      // no additional admin commands
    })
  }

  onDirectMessage (message) {
    const handled = super.onDirectMessage(message)
    if (!handled) {
      // - check if eval
      // - just eval
      console.log('No command')
    }
  }

  onChannelMessage (message) {
    const handled = super.onChannelMessage(message)
    if (!handled) {
      // - check if mentioned
      // - check if eval
      console.log('No command')
    }
  }
}

module.exports = MathBot
