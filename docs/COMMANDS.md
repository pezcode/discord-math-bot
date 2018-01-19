Bot Commands
============

Commands need to be called with the configured prefix (see [SETUP](SETUP.md)). With the default prefix of `.`, you would call command _clear_ like this: `.clear`

The bot listens for commands in direct messages and server text channels. If the bot doesn't have write access to a channel, it will ignore all messages. Messages from other bots are also ignored.

Commands can have parameters. They come after the command name, seperated by spaces.

## stop

Stops the bot. **Requires owner privileges**.

## clear

Clears the current channel's scope (ie. defined variables).

If the current channel is not a direct message, the user must have the *MANAGE_CHANNELS* permission.

## help

Prints help about the bot and math.js.

If no parameter is specified, displays a link to [HELP](HELP.md). If there is a parameter, prints documentation about math.js functions, types and constants.

Examples:
```
.help matrix
.help sin
.help pi
```
