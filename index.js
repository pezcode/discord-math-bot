"use strict";

var discord = require('discord.js');
var config = require('./config.json');

console.log('Booting...');

var closing = false;

var client = new discord.Client();
var me = null;

if(config.client_id) {
    //var P = discord.Constants.Permissions; // discord.Constants is null?
    //var permissions = P.readMessages + P.sendMessages;
    var permissions = 0x00000400 + 0x00000800; // READ_MESSAGES, SEND_MESSAGES
    var invite_url = 'https://discordapp.com/oauth2/authorize?client_id=' + config.client_id + '&scope=bot&permissions=' + permissions;
    console.log('Invite URL: ' + invite_url);
}

function checkServerLists(server) {
    // whitelist overrides blacklist
    if(config.server_whitelist.length > 0 && config.server_whitelist.indexOf(server.id) == -1) {
        console.log('Leaving ' + server.name + ', not on whitelist');
        server.leave();
    }
    if(config.server_blacklist.indexOf(server.id) >= 0) {
        console.log('Leaving ' + server.name + ', on blacklist');
        server.leave();
    }
}

client.on('ready', () => {
    me = client.user;
    console.log('Logged in as ' + me.username + '#' + me.discriminator);
    // me.id is the bot's user id, not the app's client id

    client.servers.forEach( function(server) {
        console.log('Connected to server ' + server.name + ' (' + server.id + ')');
        checkServerLists(server);
    });
});

client.on('serverCreated', server => {
    console.log('Joined server ' + server.name + ' (' + server.id + ')');
    checkServerLists(server);
});

client.on('serverDeleted', server => {
    console.log('Left server ' + server.name + ' (' + server.id + ')');
});

client.on('disconnected', () => {
    console.log('Disconnected');
    process.exit(closing ? 0 : 1);
});

client.on('error', error => {
    console.log('Fatal error: ' + error);
});

// graceful shutdown on CTRL+C
// only works with node index.js, not npm start
process.on('SIGINT', () => client.logout() );

client.loginWithToken(config.bot_token)
    .catch(error => {
        console.log('Error while logging in: ' + error);
        process.exit(1);
    });
