import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from './DB'
export const baseStore = defineStore('base', () => {
  const count = ref(0)
  console.log(db)

  return {
    count: count,
    addCount: async () => {
      count.value++
    },
  }
})
