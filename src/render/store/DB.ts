import knex from 'knex'
import path from 'path'
import fs from 'fs-extra'
// import { type Database } from 'better-sqlite3'
// const DB = require('better-sqlite3')
// const nodeDir =
//   process.env.NODE_ENV === 'development'
//     ? './node_modules/better-sqlite3/build/Release/better_sqlite3.node'
//     : require('bindings')()
const dbPath = path.join(process.cwd(), './data/db.db')
const originDbPath =
  process.env.NODE_ENV === 'development'
    ? path.join(process.cwd(), './public/originDB/db.db')
    : path.join(process.cwd(), './resources/app/originDB/db.db')
fs.ensureDirSync(path.dirname(dbPath))
if (!fs.pathExistsSync(dbPath)) {
  fs.copySync(originDbPath, dbPath)
}
export function connectDB() {
  return knex({
    client: 'better-sqlite3',
    connection: { filename: dbPath },
    useNullAsDefault: true,
  })
}
