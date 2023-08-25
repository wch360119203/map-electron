import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type Database } from 'better-sqlite3'
export const baseStore = defineStore('base', () => {
  const count = ref(0)
  const Database = require('better-sqlite3')
  const nodeDir =
    process.env.NODE_ENV === 'development'
      ? './node_modules/better-sqlite3/build/Release/better_sqlite3.node'
      : require('bindings')()
  const db = new Database('db.db', {
    verbose: console.log,
    nativeBinding: nodeDir,
  }) as Database
  console.log(db)
  return {
    count: count,
    addCount: () => {
      count.value++
    },
  }
})
