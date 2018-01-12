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
    if (content.startsWith(this.options.command_prefix)) {
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
    const command = this.parseCommand(message.cleanContent)
    if (command) {
      if (command.valid) {
        if (command.admin && !this.isOwner(message.author)) {
          message.reply('Command ' + command.name + ' only invocable by bot owner')
          console.log('Command ' + command.name + ' only invocable by bot owner')
        } else {
          console.log('Invoking command ' + command.name)
          const reply = command.func(message, command.args)
          if (reply) {
            message.reply(reply)
          }
        }
      } else {
        message.reply('Invalid command: ' + command.name)
        console.log('Invalid command: ' + command.name)
      }
      return true
    } else {
      return false
    }
  }

  isDirectMessage (message) {
    return (message.channel.type === 'dm')
  }

  isGuildMessage (message) {
    return (message.channel.type === 'text')
  }

  // Events

  onReady () {
    console.log('Logged in as ' + this.client.user.tag)
    for (const guild of this.client.guilds.values()) {
      console.log('Connected to server ' + guild.name + ' (' + guild.id + ')')
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
    // TODO write hello message
  }

  onGuildDelete (guild) {
    console.log('Left guild ' + guild.name + ' (' + guild.id + ')')
    // TODO write goodbye message? Is that possible?
  }

  // Chat messages

  onMessage (message) {
    if (!this.isMe(message.author)) {
      if (this.isDirectMessage(message)) {
        this.onDirectMessage(message)
      } else if (this.isGuildMessage(message)) {
        this.onGuildMessage(message)
      }
    }
  }

  onDirectMessage (message) {
    console.log('Direct message from ' + message.author.tag + ': ' + message.cleanContent)
    return this.handleIfCommand(message)
  }

  onGuildMessage (message) {
    console.log('Message from ' + message.author.tag + ' in [' + message.guild.name + ']#' + message.channel.name + ': ' + message.cleanContent)
    return this.handleIfCommand(message)
  }
}

module.exports = DiscordBot