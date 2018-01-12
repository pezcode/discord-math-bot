'use strict'

const DiscordBot = require('./discordbot.js')
const Parser = require('./math/parser.js')

class MathBot extends DiscordBot {
  constructor (options) {
    super(options)

    Object.assign(this.commands, {
      clear: this.onCommandClear.bind(this)
    })

    Object.assign(this.adminCommands, {
      clearall: this.onCommandClearAll.bind(this)
    })

    // TODO persist scopes
    this.scopes = new Map()
  }

  evalMessage (message) {
    // TODO better error messages
    try {
      const key = message.channel.id
      let scope = { }
      if (this.scopes.has(key)) {
        scope = this.scopes.get(key)
      } else {
        this.scopes.set(key, scope)
      }
      const parser = new Parser(message.cleanContent)
      const node = parser.parse(scope)
      const result = node.eval()
      return result.toString()
      // prettify result
      // result.getType
    } catch (err) {
      console.error(err)
      return 'Error: ' + err.message
    }
  }

  onDirectMessage (message) {
    const handled = super.onDirectMessage(message)
    if (!handled) {
      // always eval the message, but strip eval prefix if necessary
      const content = message.cleanContent
      if (content.startsWith(this.options.eval_prefix)) {
        content = content.substring(this.options.eval_prefix.length)
      }
      const result = this.evalMessage(message)
      message.reply(result)
    }
  }

  onGuildMessage (message) {
    const handled = super.onGuildMessage(message)
    if (!handled) {
      // - check if mentioned
      // - check if eval
    }
  }

  onCommandClear (message) {
    this.scopes.delete(message.channel.id)
    console.log('Clearing parser scope')
    return 'Scope cleared'
  }

  onCommandClearAll (message) {
    this.scopes.clear()
    console.log('Clearing all parser scopes')
    return 'All scopes cleared'
  }
}

module.exports = MathBot
