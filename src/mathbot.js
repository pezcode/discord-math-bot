'use strict'

const DiscordBot = require('./discordbot.js')
const Parser = require('./math/parser.js')

class MathBot extends DiscordBot {
  constructor (options) {
    super(options)

    Object.assign(this.commands, {
      clear: () => {
        this.parser.clear()
        console.log('Clearing parser scope')
        return 'Scope cleared'
      }
    })

    Object.assign(this.adminCommands, {
      // no additional admin commands
    })

    // TODO keep parser per user
    this.parser = new Parser()
  }

  onDirectMessage (message) {
    const handled = super.onDirectMessage(message)
    if (!handled) {
      // - check if eval
      // - just eval
    }
  }

  onGuildMessage (message) {
    const handled = super.onGuildMessage(message)
    if (!handled) {
      // - check if mentioned
      // - check if eval
    }
  }
}

module.exports = MathBot
