<template>
  <input
    ref="inputDom"
    type="file"
    :accept="props.accept"
    multiple
    @change="triggerInput"
    :style="{ visibility: 'hidden', position: 'fixed' }"
  />
  <span @click="inputDom?.click()">
    <slot></slot>
  </span>
  <!-- <div v-for="item in readers" :key="item.name">
    <div>
      <ElText type="primary" class="marggin-right-8">
        {{ item.name }}
      </ElText>
      <ElText
        v-if="item.state !== 'wait'"
        type="info"
        size="small"
        class="marggin-right-8"
      >
        {{ formatFileSize(item.loaded ?? 0) }} /
        {{ formatFileSize(item.total ?? 0) }}
      </ElText>
    </div>
    <div>
      <ElProgress
        :percentage="+((item.loaded ?? 0) / (item.total ?? 1)).toFixed(0) * 100"
        :status="formatStatus(item.state)"
      ></ElProgress>
    </div>
  </div> -->
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
// import { formatFileSize } from '@/ts/utils'
const inputDom = ref<HTMLInputElement>()
const emits = defineEmits<{
  (
    e: 'loadend',
    payload: { result: ArrayBuffer; name: string; total: number },
  ): void
}>()
const props = defineProps<{
  accept?: string
}>()

interface readerState {
  state: 'wait' | 'loading' | 'abort' | 'error' | 'end'
  loaded?: number
  total?: number
  name: string
}
const readers = ref(Array<readerState>())
function triggerInput(e: Event) {
  readers.value = []
  const targetDom = e.target as HTMLInputElement
  const files = targetDom.files
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const reader = new FileReader()
      const item: readerState = reactive({
        state: 'wait',
        name: file.name,
      })
      readers.value.push(item)
      reader.onabort = () => {
        item.state = 'abort'
      }
      reader.onerror = () => {
        item.state = 'error'
      }
      reader.onloadstart = (e) => {
        item.total = e.total
        item.loaded = e.loaded
        item.state = 'loading'
      }
      reader.onprogress = (e) => {
        item.total = e.total
        item.loaded = e.loaded
      }
      reader.onloadend = () => {
        item.state = 'end'
        if (reader.result instanceof ArrayBuffer)
          emits('loadend', {
            result: reader.result,
            name: item.name,
            total: item.total ?? NaN,
          })
      }
      reader.readAsArrayBuffer(file)
    }
  }
  targetDom.value = ''
}
// function formatStatus(state: readerState['state']) {
//   switch (state) {
//     case 'end':
//       return 'success'
//     case 'abort':
//       return 'exception'
//     case 'error':
//       return 'warning'
//     default:
//       return
//   }
// }
</script>
