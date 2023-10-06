<template>
  <div>
    <h2>图层</h2>
    <ElScrollbar max-height="30vh"
      ><p
        v-for="(item, index) in records"
        :key="index"
        class="scrollbar-demo-item"
      >
        {{ item.name }}
      </p>
    </ElScrollbar>
    <ElDivider></ElDivider>
  </div>
</template>
<script setup lang="ts">
import { BookRecords, bookRecords } from '@/render/store'
import { onMounted, ref } from 'vue'

const records = ref<bookRecords[]>([])
async function reflash() {
  records.value = await BookRecords.instance.select()
}
onMounted(() => {
  reflash()
})
</script>
