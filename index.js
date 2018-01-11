"use strict";

var discord = require('discord.js');
var config = require('./config.json');

console.log('Booting...');

var closing = false;

var client = new discord.Client();
var me = null; // the bot user

client.login(config.bot_token)
    .then(token => client.generateInvite(['VIEW_CHANNEL', 'SEND_MESSAGES']))
    .then(link => {
      console.log('Invite link: ' + link)
    })
    .catch(error => {
        console.error('Error while logging in: ' + error.message);
        process.exitCode = 1;
    });

function checkGuildLists(guild) {
    // whitelist overrides blacklist
    if(config.guild_whitelist.length > 0 && config.guild_whitelist.indexOf(guild.id) === -1) {
        console.log('Leaving ' + guild.name + ', not on whitelist');
        guild.leave();
    }
    if(config.guild_blacklist.indexOf(guild.id) !== -1) {
        console.log('Leaving ' + guild.name + ', on blacklist');
        guild.leave();
    }
}

function isOwner(user) {
  return (config.owner_ids.indexOf(user.id) !== -1)
}

client.on('ready', () => {
    me = client.user;
    console.log('Logged in as ' + me.username + '#' + me.discriminator);
    // me.id is the bot's user id, not the app's client id

    client.guilds.forEach( function(guild) {
        console.log('Connected to server ' + guild.name + ' (' + guild.id + ')');
        checkGuildLists(guild);
    });
});

client.on('message', message => {
    console.log('Message from ' + message.author.tag + ': ' + message.cleanContent);
    if (isOwner(message.author) && message.cleanContent.toLowerCase() === 'stop') {
      client.destroy()
    }
});

client.on('guildCreate', guild => {
    console.log('Joined server ' + guild.name + ' (' + guild.id + ')');
    checkServerLists(guild);
    // TODO write hello message
    // write goodbye message when leaving because banned
});

client.on('guildDelete', guild => {
    console.log('Left server ' + guild.name + ' (' + guild.id + ')');
});

client.on('disconnect', event => {
    console.log('Disconnected with code ' + event.code + ' (' + event.reason + ')');
    client.destroy()
});

client.on('error', error => {
    console.error('Fatal error: ' + error.message);
});

client.on('warn', info => {
    console.log('Warning: ' + info);
});

// graceful shutdown on CTRL+C
process.on('SIGINT', () => client.destroy() );
