'use strict'

const MathBot = require('./src/mathbot.js')
const config = require('./config.json')

// load vars in .env file into process.env
require('dotenv').config()

// TODO prevent two instances running
let bot = new MathBot(config)

// graceful shutdown on CTRL+C
process.on('SIGINT', () => {
  bot.stop()
})

bot.start()
