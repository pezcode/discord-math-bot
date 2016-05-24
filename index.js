"use strict";

var discord = require('discord.js');
var config = require('./config.json');

console.log('Booting...');

var closing = false;

var client = new discord.Client({
    revive : true // attempt reconnect when disconnected
});

var me = null; // the bot user

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
    // TODO write hello message
    // write goodbye message when leaving because banned
});

client.on('serverDeleted', server => {
    console.log('Left server ' + server.name + ' (' + server.id + ')');
});

client.on('disconnected', () => {
    console.log('Disconnected');
    /*
    if (!closing) {
        // disconnected without explicitly logging out
        process.exitCode = 1;
    }
    */
});

client.on('error', error => {
    console.error('Fatal error: ' + error);
});

// graceful shutdown on CTRL+C
process.on('SIGINT', () => client.logout() );

client.loginWithToken(config.bot_token)
    .catch(error => {
        console.error('Error while logging in: ' + error.message);
        process.exitCode = 1;
    });
