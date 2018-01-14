Help
====

## Expressions

Since discord-math-bot uses `math.js` as its expression parser, its [documentation](http://mathjs.org/docs/index.html) is a good starting point.

You'll probably want to read about:
- [syntax and units](http://mathjs.org/docs/expressions/syntax.html)
- [functions](http://mathjs.org/docs/reference/functions.html)
- [available constants](http://mathjs.org/docs/reference/constants.html)

## Multiline expressions

You can write multiline expressions so you don't have to wait a for a reply after each line. It also keeps the chat window cleaner without intermediate results after each expression.

There are two ways to do this:
- `Shift + Enter` in Discord's message field creates a new line instead of sending the message
- Seperate expressions with a semicolon:
```js
a = 3; b = 2; a + b
```

There is another advantage: For security reasons you can't keep functions in the global scope (see *Scope* further below). Allowing that would mean loading and executing arbitrary JavaScript functions from the database. To still be able to define and use functions, you need to do it all within one message:
```js
f(x)=x^2; f(3)
```

## Examples

Some examples, mostly taken from the [math.js examples section](http://mathjs.org/examples/index.html):

#### Basic usage
```js
// expressions
x = 2 * (2 + 4.5) // -> 13
x - 6 / 2 // -> 10
// functions and constants
sin(45 deg) ^ 2 // -> 0.5
atan2(3, -3) / pi
```

#### Logical operators
```js
not (true xor true) // -> true
// conditional expressions
15 > 100 ? 1 : -1
// bitwise operators
(8 >> 1) & 7 // -> 4
// results are treated as signed integers
~2 // -> -3
```

#### Complex numbers
```js
c = 5 + 3i + 3 - 7i // -> 8 - 4i
// from polar coordinates
d = complex({r: sqrt(2), phi: pi/4}) // -> 1 + i
// functions
re(c) // -> 8
sqrt(-4) // -> 2i
```

#### Arrays
```js
v = [1, 2, 3, 4]
// indexing starts at 1
v[2] // -> 2
// functions on arrays (works on matrices too)
factorial(v) // -> [1, 2, 6, 24]
```

#### Matrices
```js
A = [[1, 2], [3, 4]] // [[row 1], [row 2], ...]
B = [1, 2; 3, 4] // same thing, different syntax
A == B // -> [[true, true], [true, true]]
M = ones(4, 5)
// size
size(M) // -> [4, 5]
// indexing: [row, column]
A[2, 2] // -> 4
// index more than one element with a range: start:stop
// you can skip the start or end in the range
// : means all elements
// extracting a row
A[1, :] // -> [[1, 2]]
// extracting a column
A[:, 1] // -> [[1], [3]]
// replacing a submatrix
M[4:, :3] = zeros(1, 3) // set the first 3 colums in the last row to zero
// operations
D = A - B
M * eye(3, 2)
det(A) // -7
// column vector
[1; 2; 3]
```

#### Units
```js
5 mm * 3 // -> 15 mm
// conversion
12.7 cm to inch // -> 5 inch
460 V * 20 A * 30 days to kWh // 6624 kWh
// simplification
9.81 m/s^2 * 100 kg * 40 m // -> 39.24 kJ
// arrays
[1, 2, 3] m/s * 5 -> [5 m / s, 10 m / s, 15 m / s]
```

#### Misc
```js
// functions
f(x)=x^2
f(3) // -> 9
// objects
k = {a: 1, b: 2}
k.a + k.b // -> 3
// strings
a = "123"
b = "456"
// adding with + will convert strings to numbers and use addition!
c = concat(a, b) // -> "123456"
number(c) // -> 123456
max("apple", "carrot", "snake") // -> snake
// fractions
f = fraction(1/3) // -> 0.(3)
// ranges
1:4 // -> [1,2,3,4]
// ranges with step value
1:3:10 // -> [1, 4, 7, 10]
// variable type
z = 2 + i
typeof(z) // -> Complex
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
- Matrix functions
  - `forEach`
- String functions
  - `format`
  - `print`

They can neither be called nor assigned to other variables.

## Bot commands

Commands need to be called with the configured prefix (see [SETUP](SETUP.md)). With the default prefix of `.`, you would call command _clear_ like this: `.clear`

Commands can have parameters. They come after the command name, seperated by spaces.

The bot listens for commands in direct messages and server text channels. Messages from other bots are ignored.

### stop

Stops the bot. **Requires owner privileges**.

_Note_: If you stop the bot while running the `forever` script, it will instantly restart.

### clear

Clears the current channel's scope (ie. defined variables).

If the current channel is not a direct message, the user must have the *MANAGE_CHANNELS* permission.

### help

Prints help about the bot and math.js.

If no parameter is specified, displays a link to this document. If there is a parameter, prints documentation about math.js functions, types and constants.

Examples:
```
.help matrix
.help sin
.help pi
```

## Inviting the bot

Start the bot (refer to [SETUP](SETUP.md)) and it will tell you the invite link. Open that in your browser, log in with your Discord account and select the server.
