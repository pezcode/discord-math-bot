Setup
=====

You'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/pezcode/discord-math-bot.git
# Go into the repository
cd discord-math-bot
# Install dependencies
npm install
```

## Database

You also need an instance of [CouchDB](http://couchdb.apache.org/). If you want to install and run it locally, follow the [documentation](http://docs.couchdb.org/en/master/install/index.html).

Configuration
=============

Bot configuration is stored in _config.json_. Rename _config.json.example_ to _config.json_ and open it in the text editor of your choice.

### Discord

You will need a Discord Bot App to run the bot. Go to the [Discord Developer website](https://discordapp.com/developers/applications/me) and create a new bot app. Replace `bot_token` with the secret bot token given for your app.
**Don't share the token with other people!**

## Bot

The bot can be configured with additional settings in _config.json_:

- `command_prefix`:
  - prefix for bot commands
  - default is `.`
- `eval_prefix`:
  - prefix for evaluating expressions
  - default is `?`
- `owner_ids`:
  - list of Discord user IDs the bot considers 'owners'
  - only owners can run admin commands
- `guild_whitelist`:
  - list of discord server IDs
  - if there is at least one ID in the whitelist, the bot leaves any server that's not listed
  - to allow all servers (except the ones in the blacklist), keep empty
- `guild_blacklist`:
  - list of discord server IDs
  - the bot leaves any server that's on the list
  - blacklist has priority over whitelist (ie. the bot leaves servers that are on both lists)

## Database

Database configuration is stored in the following environment variables:

- `DB_HOST`: url to your CouchDB instance (a standard install runs at http://localhost:5984)
- `DB_NAME`: name of the database used to store calculation results
- `DB_USER`: the user to authenticate with
- `DB_PASS`: the password

You can rename _.env.example_ to _.env_ and edit the given default values. Variables found in _.env_ override environment variables.

Before you start the bot, make sure `DB_NAME` is an existing database. To create a new database, I recommend using the CouchDB frontend [Fauxton](http://couchdb.apache.org/fauxton-visual-guide/).

Execution
=========

To start the bot simply:

```bash
npm start
```

To run and restart on changes to source files (useful during development):

```bash
npm run watch
```

If you need a good process manager for running this on a server, I would suggest [PM2](http://pm2.keymetrics.io/).

## Inviting the bot

After starting the bot it will tell you the invite link. Open that in your browser, log in with your Discord account and select a server.
