To-Do
=====

## Discord
- send multiple messages if message exceeds character limit
  - https://github.com/hydrabolt/discord.js/issues/653
- config per server (what permissions are required?)

## Math interface
- cache scopes in memory -> this would also allow function definitions
  - https://www.npmjs.com/package/lru-cache
  - limit RAM usage
    - cache_size in config.json
    - https://www.npmjs.com/package/object-sizeof
- otherwise, completely prevent saving of functions to scope
  - take away space, cause syntax errors on attempted calls
