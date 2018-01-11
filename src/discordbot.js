'use strict'

const discord = require('discord.js')

class DiscordBot {
  constructor (config) {
    this.config = config
    this.client = new discord.Client()

    this.client.on('ready', this.onReady.bind(this))
    this.client.on('disconnect', this.onDisconnect.bind(this))
    this.client.on('error', this.onError.bind(this))
    this.client.on('warn', this.onWarning.bind(this))
    this.client.on('guildCreate', this.onGuildCreate.bind(this))
    this.client.on('guildDelete', this.onGuildDelete.bind(this))
  }

  start () {
    console.log('Starting up')
    this.login()
  }

  stop () {
    this.exit = true
    this.logout()
  }

  login () {
    this.client.login(this.config.bot_token)
        .then(token => this.client.generateInvite(['VIEW_CHANNEL', 'SEND_MESSAGES']))
        .then(link => {
          console.log('Invite link: ' + link)
        })
        .catch(error => {
            console.error('Error while logging in: ' + error.message);
        })
  }

  logout () {
    this.client.destroy()
  }

  isOwner (user) {
    return (this.config.owner_ids.indexOf(user.id) !== -1)
  }

  checkGuildLists(guild) {
      // whitelist overrides blacklist
      if(this.config.guild_whitelist.length > 0 && this.config.guild_whitelist.indexOf(guild.id) === -1) {
          console.log('Leaving ' + guild.name + ', not on whitelist')
          guild.leave()
      }
      if(this.config.guild_blacklist.indexOf(guild.id) !== -1) {
          console.log('Leaving ' + guild.name + ', on blacklist')
          guild.leave()
      }
  }

  onReady () {
    console.log('Logged in as ' + this.client.user.tag);
    this.client.guilds.forEach(guild => {
        console.log('Connected to server ' + guild.name + ' (' + guild.id + ')')
        this.checkGuildLists(guild)
    })
  }

  onDisconnect (event) {
      console.log('Disconnected with code ' + event.code + ' (' + event.reason + ')');
      if (this.exit) {
        console.log('Shutting down')
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
      this.checkGuildLists(guild)
      // TODO write hello message
  }

  onGuildDelete (guild) {
      console.log('Left guild ' + guild.name + ' (' + guild.id + ')')
      // TODO write goodbye message? Is that possible?
  }
}

module.exports = DiscordBot
