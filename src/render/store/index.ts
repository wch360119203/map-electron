import { defineStore } from 'pinia'
import { ref } from 'vue'
export * from './sqlite'
export const baseStore = defineStore('base', () => {
  const count = ref(0)
  return {
    count: count,
    addCount: async () => {
      count.value++
    },
  }
})
