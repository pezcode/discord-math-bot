'use strict'

const DiscordBot = require('./discordbot.js')
const Parser = require('./math/parser.js')
const math = require('mathjs')

class MathBot extends DiscordBot {
  constructor (options) {
    super(options)

    Object.assign(this.commands, {
      clear: this.onCommandClear.bind(this),
      help: this.onCommandHelp.bind(this)
    })

    Object.assign(this.adminCommands, {
      clearall: this.onCommandClearAll.bind(this)
    })

    // TODO persist scopes
    // use CouchDB and nano js bindings
    // eventual consistency
    // -> good for sharding
    this.scopes = new Map()
  }

  getScope (id, create = true) {
    if (this.scopes.has(id)) {
      return this.scopes.get(id)
    } else {
      let scope = { }
      if (create) {
        this.scopes.set(id, scope)
      }
      return scope
    }
  }

  deleteScope (id) {
    this.scopes.delete(id)
  }

  deleteAllScopes () {
    this.scopes.clear()
  }

  evalMessage (channelId, content) {
    let scope = this.getScope(channelId)
    try {
      const parser = new Parser(content)
      const node = parser.parse(scope) // throws Error (blocked function), SyntaxError
      const result = node.eval() // throws Error
      return this.formatEvalResult(result)
    } catch (err) {
      // DimensionError (matrix)
      if (err instanceof SyntaxError) {
        // err.char = position
      } else if (err instanceof TypeError) {
        // err.expected = array of strings with names of expected types
        // err.actual = object (can use math.typeof to get the name)
      }
      console.error(err)
      return MathBot.errorIcon + ' ' + err.message
    }
  }

  formatEvalResult (value) {
    // TODO prettify
    // check type -> value.getType
    // dont print Function
    // generic Object? -> make sure it's not from mathjs and printable
    return value.toString()
  }

  isEvalMessage (content) {
    return content.startsWith(this.options.eval_prefix)
  }

  stripEvalPrefix (content) {
    if (content.startsWith(this.options.eval_prefix)) {
      return content.substring(this.options.eval_prefix.length)
    } else {
      return content
    }
  }

  onDirectMessage (message) {
    let handled = super.onDirectMessage(message)
    if (!handled) {
      // always eval the message, but strip prefix if necessary
      const content = this.stripEvalPrefix(message.cleanContent)
      const result = this.evalMessage(message.channel.id, content)
      message.reply(result)
      handled = true
    }
    return handled
  }

  onGuildMessage (message) {
    let handled = super.onGuildMessage(message)
    if (!handled) {
      let content = message.cleanContent
      if (this.isEvalMessage(content)) {
        content = this.stripEvalPrefix(content)
      } else if (!message.isMentioned(this.me())) {
        // ignore message
        return
      }
      const result = this.evalMessage(message.channel.id, content)
      message.reply(result)
      handled = true
    }
    return handled
  }

  onCommandHelp (message, params) {
    let helptext = ''
    if (params.length > 0) {
      // item help
      const item = params[0]
      try {
        helptext = MathBot.helpIcon + ' **' + item + '**\n' +
          '```' + math.help(item) + '```'
      } catch (err) {
        helptext = MathBot.errorIcon + ' No documentation found for **' + item + '**'
      }
      // ignore extra params
    } else {
      // Generic help
      helptext = MathBot.helpIcon + '\n' +
        'Type **help x** to get help for function ***x***.\n' +
        'For general help and a list of all data types, functions and symbols, visit:\n' +
        MathBot.helpLink
    }
    return helptext
  }

  onCommandClear (message, params) {
    // clear current channel scope
    if (this.isDirectMessage(message) ||
        this.isOwner(message.user) ||
        message.member.hasPermission('MANAGE_CHANNELS', false, true, true)) {
      this.deleteScope(message.channel.id)
    } else {
      console.log('Attempted to clear scope without permission')
      return MathBot.errorIcon + ' MANAGE_CHANNELS permission / admin / server owner role required'
    }
    console.log('Clearing parser scope')
    return 'Scope cleared'
  }

  onCommandClearAll (message) {
    this.deleteAllScopes()
    console.log('Clearing all parser scopes')
    return 'All scopes cleared'
  }
}

// TODO make this configurable
MathBot.helpLink = 'https://github.com/pezcode/discord-math-bot/blob/master/README.md'
MathBot.helpIcon = ':grey_question:'
MathBot.errorIcon = ':exclamation:'

module.exports = MathBot
