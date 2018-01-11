'use strict'

const MathBot = require('./src/mathbot.js');
const config = require('./config.json');

let bot = new MathBot(config);

// graceful shutdown on CTRL+C
process.on('SIGINT', () => bot.stop() );

bot.start()
