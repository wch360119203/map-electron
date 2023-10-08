<template>
  <span ref="container">
    <ElScrollbar width="600px" max-height="300px">
      <div>台账:</div>
      <ElTable :data="book">
        <el-table-column prop="0" label="键" />
        <el-table-column prop="1" label="值" width="120" />
      </ElTable>
      <div>工参</div>
      <ElTable :data="workparams">
        <el-table-column prop="0" label="键" />
        <el-table-column prop="1" label="值" width="120" />
      </ElTable>
    </ElScrollbar>
  </span>
</template>
<script setup lang="ts">
import { acRecord, workParam } from '@/render/store'
import { computed, ref, onMounted } from 'vue'
import { ElScrollbar, ElTable, ElTableColumn } from 'element-plus'
const props = defineProps<{
  data: {
    book: acRecord
    wp: workParam
  }
}>()
const book = computed(() => {
  return Array.from(Object.entries(JSON.parse(props.data.book.origin_data)))
})
const workparams = computed(() => {
  return Array.from(Object.entries(JSON.parse(props.data.wp.origin_data)))
})
const container = ref<HTMLElement>()
onMounted(() => {
  container.value?.addEventListener('wheel', (e) => {
    e.stopPropagation()
  })
})
</script>
