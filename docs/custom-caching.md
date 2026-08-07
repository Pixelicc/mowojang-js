# 💾 Custom Caching / Storage

As the `Mowojang` library just uses the `axios-cache-interceptor` library internally you can also follow their docs on the two exported builders accessable via the cache export: `buildMemoryStorage()` and `buildStorage()`.

Docs: https://axios-cache-interceptor.js.org/guide/storages

## Custom Memory Storage

```TS
import { Client, cache } from "mowojang"

const Mowojang = new Client({
  cache: {
    storage: cache.buildMemoryStorage(
      false, // Doesn't clone data
      60 * 60 * 1000, // Cleans outdated cache entries every hour
      false, // Doesn't set a max entry limit
      60 * 60 * 1000 // Cleans stale cache entries every hour
      /**
       * More detailed documentation:
       *
       * https://axios-cache-interceptor.js.org/guide/storages#memory-storage
       */
    )
  }
})
```

## Custom Storage

```TS
import { Client, cache } from "mowojang"

const Mowojang = new Client({
  cache: {
    storage: cache.buildStorage({
      /**
       * More detailed documentation:
       *
       * https://axios-cache-interceptor.js.org/guide/storages#buildstorage
       */
    })
  }
})
```

> [!WARNING]
> The cache utilities exposed by Mowojang can read and manipulate the internal storage used by `axios-cache-interceptor`.
> Only use them if you know exactly what you are doing. Writing invalid cache values, deleting required keys, or clearing storage at the wrong time can break cache behavior.

## Internal Cache Access

Every `Client` instance exposes `client.cache` helpers:

- `clear()`
- `set(key, value)`
- `get(key)`
- `del(key)`
- `has(key)`
- `_storage`

`client.cache._storage` is a direct reference to the underlying `axios-cache-interceptor` storage instance.
