'use strict'

const DiscordBot = require('./discordbot.js')
const Parser = require('./math/parser.js')
const Value = require('./math/value.js')
const math = require('mathjs')
const Store = require('./store.js')

class MathBot extends DiscordBot {
  constructor (options) {
    super(options)

    Object.assign(this.commands, {
      clear: this.onCommandClear.bind(this),
      help: this.onCommandHelp.bind(this)
    })

    this.scopes = new Store()
  }

  hasEvalPrefix (message) {
    return message.stripped.startsWith(this.options.eval_prefix)
  }

  stripEvalPrefix (content) {
    if (content.startsWith(this.options.eval_prefix)) {
      return content.substring(this.options.eval_prefix.length)
    } else {
      return content
    }
  }

  handleEvalMessage (message) {
    const content = this.stripEvalPrefix(message.stripped)
    if (!content) {
      console.log('Empty message')
      return false
    } else {
      this.scopes.load(message.channel.id, doc => {
        let scope = doc.content
        const result = this.evalExpression(content, scope)
        message.reply(result)
        doc.content = scope
        this.scopes.save(message.channel.id, doc)
      }, math.json.reviver) // http://mathjs.org/examples/serialization.js.html
      return true
    }
  }

  evalExpression (expression, scope) {
    try {
      const parser = new Parser(expression)
      const node = parser.parse(scope) // throws Error (blocked function), SyntaxError
      const result = node.eval() // throws Error, TypeError, DimensionError, RangeError
      return '```js\n' + this.formatEvalResult(result) + '\n```'
    } catch (err) {
      console.error(err)
      return MathBot.errorIcon + ' ' + err.message
    }
  }

  formatEvalResult (result) {
    console.log(result)
    switch (result.type) {
      case 'string':
        return '"' + result.toString() + '"'
      case 'Object':
        if (result.value.isResultSet) { // only show last
          const set = result.value.entries
          return this.formatEvalResult(new Value(set[set.length - 1]))
        } else {
          return result.toString()
        }
      case 'Matrix': // one line for each row, but not for too large matrices
        if (result.value._size.length === 2 && result.value._size[0] <= 10) {
          return '[' + result.value._data.join(']\n[') + ']'
        } else {
          return result.toString()
        }
      default:
        return result.toString()
    }
  }

  onMessage (message) {
    if (!this.isChannelWritable(message.channel)) {
      console.log('Message from read-only channel, ignoring')
    } else {
      super.onMessage(message)
    }
  }

  onDirectMessage (message) {
    let handled = super.onDirectMessage(message)
    if (!handled) {
      // always eval the message
      handled = this.handleEvalMessage(message)
    }
    return handled
  }

  onGuildMessage (message) {
    let handled = super.onGuildMessage(message)
    if (!handled) {
      if (this.hasEvalPrefix(message) || message.isMentioned(this.me())) {
        handled = this.handleEvalMessage(message)
      }
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
        'Type **help x** to get help for ***x***.\n' +
        'For general help and a list of all data types, functions and symbols, visit:\n' +
        MathBot.helpLink
    }
    return helptext
  }

  onCommandClear (message) {
    // clear current channel scope
    if (this.isDMChannel(message.channel) ||
        this.isOwner(message.user) ||
        message.member.hasPermission('MANAGE_CHANNELS', false, true, true)) {
      this.scopes.delete(message.channel.id)
    } else {
      console.log('Attempted to clear scope without permission')
      return MathBot.errorIcon + ' MANAGE_CHANNELS permission / admin / server owner role required'
    }
    console.log('Clearing parser scope')
    return 'Scope cleared'
  }
}

MathBot.helpLink = 'https://github.com/pezcode/discord-math-bot/blob/master/docs/HELP.md'
MathBot.helpIcon = ':grey_question:'
MathBot.errorIcon = ':exclamation:'

module.exports = MathBot
