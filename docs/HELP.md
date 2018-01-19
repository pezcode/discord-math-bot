Help
====

## Expressions

Since discord-math-bot uses `math.js` as its expression parser, its [documentation](http://mathjs.org/docs/index.html) is a good starting point.

You'll probably want to read about:
- [syntax and units](http://mathjs.org/docs/expressions/syntax.html)
- [functions](http://mathjs.org/docs/reference/functions.html)
- [available constants](http://mathjs.org/docs/reference/constants.html)

For a few examples and inspiration, check out [EXAMPLES](EXAMPLES.md).

## Evaluating

To get the bot to actually parse your expressions, you can either:

- mention the bot in Discord
- use the eval prefix (`?` by default, configurable -> see [SETUP](SETUP.md))

The following both do the same:

```js
@math-bot a = 2 + 3
```
```js
? a = 2 + 3
```

**In direct messages**: everything that's not a command gets parsed, so the following also works:
```js
a = 2 + 3
```

## Multiline expressions

You can write multiline expressions so you don't have to wait a for a reply after each line. It also keeps the chat window cleaner without intermediate results after each expression.

There are two ways to do this:
- `Shift + Enter` in Discord's message field creates a new line instead of sending the message
- Seperate expressions with a semicolon:
```js
a = 3; b = 2; a + b
```

## Scope

The bot keeps a scope with all defined variables for the current channel. If you define a variable `a`:
```js
a = 300
```
it will be available to use across restarts of Discord or the bot.

Channels can be either server text channels or direct messages with the bot. To completely clear the scope of the current channel, use the `clear` command.

*Note*: It is also possible to overwrite built-in math.js variables:
```js
pi = 2
```

## Disabled functions

For security reasons some functions are disabled. Namely:

- Core functions:
  - `import`
  - `config`
  - `typed`
- Construction functions:
  - `createUnit`
- Expression functions:
  - `compile`
  - `eval`
  - `help`
  - `parse`
  - `parser`
- Algebra functions:
  - `derivative`
  - `simplify`

They can neither be called nor assigned to other variables.

Creation of custom functions is also disabled for security reasons. Since they are stored in a database, this could possibly allow execution of arbitrary functions. So trying something like this:
```js
f(x) = x^2
```
will result in an error.
