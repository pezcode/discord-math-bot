To-Do
=====

## Discord
- config per server (what permissions are required?)

## Math interface
- cache scopes in memory -> this would also allow function definitions
  - https://www.npmjs.com/package/lru-cache
  - limit RAM usage
    - max scope size
    - cache_size in config.json
      - https://www.npmjs.com/package/object-sizeof
- otherwise, completely prevent saving of functions to scope
  - take away space, cause syntax errors on attempted calls
- .scope command to get info (#items, size, TTL)
