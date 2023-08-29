import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from './DB'
export const baseStore = defineStore('base', () => {
  const count = ref(0)
  db('test')
    .first()
    .then((val) => {
      count.value = val.count
    })
  return {
    count: count,
    addCount: async () => {
      count.value++
      await db('T2')
        .select('name')
        .then((v) => {
          console.log(v)
        })
      await db('test').where('ROWID', '>', 2).update({ count: count.value })
    },
  }
})
