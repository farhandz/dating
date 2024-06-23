## Description

[Hono](https://hono.dev) - [炎] means flame🔥 in Japanese - is a small, simple, and ultrafast web framework for the Edges.

## Requirements

- NodeJS v18.19.0 LTS/Hydrogen
- Bun v1.0.26

## Pre Install Package

- [husky](https://github.com/typicode/husky) - Git hooks made easy
- [zod](https://github.com/colinhacks/zod) - TypeScript schema validation with static type inference
- [luxon](https://github.com/moment/luxon) - A library for working with dates and times in JS
- [typeorm](https://github.com/typeorm/typeorm) - ORM for TypeScript and JavaScript
- [uuid](https://github.com/uuidjs/uuid) - Generate RFC-compliant UUIDs in JavaScript
- [crypto-js](https://github.com/brix/crypto-js) - JavaScript library of crypto standards
- [pg](https://github.com/brianc/node-postgres) - PostgreSQL client for node.js
- [oracledb](https://github.com/oracle/node-oracledb) - Oracle Database driver for Node.js
- [reflect-metadata](https://github.com/rbuckton/reflect-metadata) - Prototype for a Metadata Reflection API for ECMAScript

## Pre Installation

This application using [Bun](https://bun.sh) as Package Manager

- macOS, Linux, and WSL

```bash
$ curl -fsSL https://bun.sh/install | bash
```

- NPM

```bash
$ npm install -g bun
```

## Installation

```bash
# development
$ bun install

# production
$ bun install --production --frozen-lockfile --silent
```

## Running the app

```bash
# development
$ bun dev

# production
$ bun run build
$ bun start
```

## Helpers

```bash
# help
$ bun generate -h

# generate module
$ bun generate module <ModuleName>

# rollback module
$ bun generate rollback <ModuleName>

# generate migration based entity
$ bun generate migration <ModuleName>
```
