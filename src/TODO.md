To-Do
=====

## Discord
- check if we have write access to channel before evaluating
- send multiple messages if message exceeds character limit
  - https://github.com/hydrabolt/discord.js/issues/653
- config per server (what permissions are required?)

## Math interface
- cache scopes in memory -> this would also allow function definitions
  - TTL? how do you communicate functions disappearing
  - completely mem-backed, e.g. Redis? would this work with arbitrary user numbers?
- otherwise, completely prevent saving of functions to scope
  - take away space, cause syntax errors on attempted calls
