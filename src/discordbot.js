'use strict'

const discord = require('discord.js')

class DiscordBot {
  constructor (options) {
    this.options = options
    this.client = new discord.Client()

    this.commands = { }
    this.adminCommands = {
      stop: () => {
        // wait a second before shutting down
        setTimeout(this.stop.bind(this), 1000)
      }
    }

    this.client.on('ready', this.onReady.bind(this))
    this.client.on('disconnect', this.onDisconnect.bind(this))
    this.client.on('error', this.onError.bind(this))
    this.client.on('warn', this.onWarning.bind(this))
    this.client.on('guildCreate', this.onGuildCreate.bind(this))
    this.client.on('guildDelete', this.onGuildDelete.bind(this))
    this.client.on('message', this.onMessage.bind(this))
  }

  start () {
    console.log('Starting up')
    this.login()
  }

  stop () {
    console.log('Shutting down')
    this.exit = true
    this.logout()
  }

  login () {
    this.client.login(this.options.bot_token)
      .then(token => this.client.generateInvite(['VIEW_CHANNEL', 'SEND_MESSAGES']))
      .then(link => {
        console.log('Invite link: ' + link)
      })
      .catch(error => {
        console.error('Error while logging in: ' + error.message)
        process.exit(0)
      })
  }

  logout () {
    this.client.destroy()
  }

  me () {
    return this.client.user
  }

  isMe (user) {
    return (user.id === this.me().id)
  }

  isOwner (user) {
    return (this.options.owner_ids.indexOf(user.id) !== -1)
  }

  checkGuildLists (guild) {
    // whitelist overrides blacklist
    if (this.options.guild_whitelist.length > 0 && this.options.guild_whitelist.indexOf(guild.id) === -1) {
      console.log('Guild ' + guild.name + ' not on whitelist')
      return false
    }
    if (this.options.guild_blacklist.indexOf(guild.id) !== -1) {
      console.log('Guild ' + guild.name + ' on blacklist')
      return false
    }
    return true
  }

  parseCommand (content) {
    if ((content.length > this.options.command_prefix.length) && content.startsWith(this.options.command_prefix)) {
      const parts = content.trim().split(' ')
      const name = parts[0].substring(this.options.command_prefix.length).toLowerCase()
      const found = (name in this.commands)
      const foundAdmin = (name in this.adminCommands)
      return {
        valid: found || foundAdmin,
        admin: foundAdmin,
        name: name,
        args: parts.slice(1),
        func: foundAdmin ? this.adminCommands[name] : this.commands[name]
      }
    } else {
      return null
    }
  }

  handleIfCommand (message) {
    const command = this.parseCommand(message.content) // don't strip mentions, can be params
    if (!command) {
      return false
    } else if (!command.valid) {
      console.log('Unknown command: ' + command.name)
      return false
    } else {
      if (message.author.bot) {
        console.log('Command invoked by a bot, ignoring')
      } else if (command.admin && !this.isOwner(message.author)) {
        console.log('Command ' + command.name + ' only invocable by bot owner')
        message.channel.send('Command ' + command.name + ' only invocable by bot owner')
      } else {
        console.log('Invoking command ' + command.name)
        command.func(message, command.args)
      }
      return true
    }
  }

  isDMChannel (channel) {
    return (channel.type === 'dm')
  }

  isGuildChannel (channel) {
    return (channel.type === 'text')
  }

  isChannelWritable (channel) {
    return this.isDMChannel(channel) ||
      channel.permissionsFor(this.me()).has('SEND_MESSAGES')
  }

  stripMentions (text) {
    return text.replace(/<@[0-9]+>/g, '')
  }

  // send multiple messages if character count exceeds Discord's limit of (currently) 2000
  // discordjs has a split option in send() but it's a bit crude and can fail
  // this version tries to split at newlines, then at whitespace, and then anywhere as a last resort
  // also tries to keep message parts to a minimum length to not get rate limited too badly
  sendSplitMessage (channel, content, prepend = '', append = '') {
    const maxTotal = 10000 // a reasonable(?) upper limit
    const minLength = 1000
    const maxLength = 1950
    if (content.length > maxTotal) {
      console.log('Message too long, not sent')
      channel.send(DiscordBot.errorIcon + ' Reply is too long (>' + maxTotal + ')')
    } else {
      let rest = content
      let count = 0
      while (rest.length > maxLength) {
        const longest = rest.substring(0, maxLength)
        let part
        // find last newline
        let split = longest.lastIndexOf('\n')
        if (split < minLength) {
          // not found or too early, find last whitespace
          split = longest.search(/\s\S*$/)
        }
        if (split < minLength) {
          // still nothing or too early, force end of part
          part = longest
          rest = rest.substring(maxLength)
        } else {
          part = rest.substring(0, split)
          rest = rest.substring(split + 1)
        }
        channel.send((count > 0 ? prepend : '') + part + append)
        count++
      }
      channel.send((count > 0 ? prepend : '') + rest)
    }
  }

  // Events

  onReady () {
    console.log('Logged in as ' + this.client.user.tag)
    for (const guild of this.client.guilds.values()) {
      console.log('Connected to guild ' + guild.name + ' (' + guild.id + ')')
      if (!this.checkGuildLists(guild)) {
        console.log('Leaving guild')
        guild.leave()
      }
    }
  }

  onDisconnect (event) {
    console.log('Disconnected with code ' + event.code + ' (' + event.reason + ')')
    if (this.exit) {
      process.exit(0)
    }
  }

  onError (error) {
    console.error('Fatal error: ' + error.message)
  }

  onWarning (info) {
    console.log('Warning: ' + info)
  }

  onGuildCreate (guild) {
    console.log('Joined guild ' + guild.name + ' (' + guild.id + ')')
    if (!this.checkGuildLists(guild)) {
      console.log('Leaving guild')
      guild.leave()
    }
  }

  onGuildDelete (guild) {
    console.log('Left guild ' + guild.name + ' (' + guild.id + ')')
  }

  // Chat messages

  onMessage (message) {
    message.stripped = this.stripMentions(message.content).trim()
    if (!this.isMe(message.author) && !message.system) {
      if (this.isDMChannel(message.channel)) {
        this.onDirectMessage(message)
      } else if (this.isGuildChannel(message.channel)) {
        this.onGuildMessage(message)
      }
    }
  }

  onDirectMessage (message) {
    console.log('Direct message from ' + message.author.tag + ': ' + message.content)
    return this.handleIfCommand(message)
  }

  onGuildMessage (message) {
    console.log('Message from ' + message.author.tag + ' in [' + message.guild.name + ']#' + message.channel.name + ': ' + message.content)
    return this.handleIfCommand(message)
  }
}

DiscordBot.errorIcon = ':exclamation:'

module.exports = DiscordBot
