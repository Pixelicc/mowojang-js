# Mowojang-API NPM Wrapper

![NPM Version](https://img.shields.io/npm/v/mowojang?label=NPM)
![NPM Downloads](https://img.shields.io/npm/dw/mowojang?label=Downloads)
![NPM License](https://img.shields.io/npm/l/mowojang?label=License)

> [!IMPORTANT]
> This is not an official Wrapper for the [Mowojang-API](https://mowojang.matdoes.dev/)!

## ✨ Quick Start

```TS
import { Client as MowojangClient } from "mowojang"

const Mowojang = new MowojangClient()

const UUID = await Mowojang.getUUID("Pixelic")
const username = await Mowojang.getUsername("14727fae-fbdc-4aff-848c-d2713eb9939e")
```

> [!TIP]
> If you plan on using this in a long-running process with frequent usage check out this guide on how to setup custom caching to prevent memory leaks.
> Guide: [Custom-Caching](docs/custom-caching.md)

## 🔧 Functions / Supported Endpoints

- `getProfiles()`: Retrieve full Player Data of multiple Players by UUID or Username
- `getProfile()`: Retrieve full Player Data by UUID or Username
- `getSessions()`: Retrieve Player Session Data of multiple Players by UUID or Username
- `getSession()`: Retrieve Player Session Data by UUID or Username
- `getUUID()`: Converts Username to UUID
- `getUsername()`: Converts UUID to Username
- `getSkin()`: Returns the Skin the specified Player is currently wearing
- `getSkinBuffer()`: Skin-Data fetched via getSkin() as a Buffer
- `getCape()`: Returns the Cape the specified Player is currently wearing
- `getCapeBuffer()`: Cape-Data fetched via getCape() as a Buffer

All above Functions accept an second Argument containing an optional config.
Cache options can also be passed there via the cache key. All available cache options can be found [here](https://axios-cache-interceptor.js.org/config/request-specifics#cache).

## 🗃️ Utility Functions

All Utility Functions are exported combined as `utlis.x`.

- `dashUUID()`: Adds dashes to UUIDv4 (If the UUIDv4 is already dashed nothing will change)
- `undashUUID()`: Removes all dashes from UUIDv4

## 🗂️ Validator Functions

All Validator Functions are exported combined as `validate.x`.

- `UUID()`: Returns whether the provided String is an valid UUID (Accepts both undashed and dashed UUIDv4 Strings)
- `username()`: Returns whether the provided String is an valid Username
- `player()` Combines the above

## ⚙️ Development

- `pnpm install`: Installs all required dependencies
- `pnpm build`: Runs the TypeScript compiler
- `pnpm test`: Runs tests for all Functions
- `pnpm publish`: Publish the Package to NPM

## 📎 Credits

- Mowojang Creator (Mat):
  - [Website](https://matdoes.dev)
  - [GitHub](https://github.com/mat-1)
  - [Ko-Fi](https://ko-fi.com/matdoesdev)
