import { type Database } from 'better-sqlite3'
import knex from 'knex'
import path from 'path'
const DB = require('better-sqlite3')

const nodeDir =
  process.env.NODE_ENV === 'development'
    ? './node_modules/better-sqlite3/build/Release/better_sqlite3.node'
    : require('bindings')()
new DB('db.db', {
  verbose: console.log,
  nativeBinding: nodeDir,
}) as Database
export const db = knex({
  client: 'better-sqlite3',
  connection: 'db.db',
  useNullAsDefault: true,
})
