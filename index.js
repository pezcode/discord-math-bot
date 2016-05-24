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

client.on('ready', () => {
    me = client.user;
    console.log('Logged in as ' + me.username + '#' + me.discriminator);
    // me.id is the bot's user id, not the app's client id
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
