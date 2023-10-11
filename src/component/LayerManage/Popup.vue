<template>
  <span ref="container">
    <ElInput v-model="search" size="small" placeholder="筛选字段" :style="{ width: '80px' }" />
    <ElScrollbar width="600px" max-height="300px">
      <ElRow justify="center">
        <ElText type="primary" size="large">台账</ElText>
      </ElRow>
      <ElTable :data="book">
        <el-table-column prop="0" label="" />
        <el-table-column prop="1" label="" width="120" />
      </ElTable>
      <ElRow justify="center">
        <ElText type="primary" size="large">工参</ElText>
      </ElRow>
      <ElTable :data="workparams">
        <el-table-column prop="0" label="" />
        <el-table-column prop="1" label="" width="120" />
      </ElTable>
    </ElScrollbar>
  </span>
</template>
<script setup lang="ts">
import { acRecord, workParam } from '@/render/store'
import { computed, ref, onMounted } from 'vue'
import { ElScrollbar, ElTable, ElTableColumn, ElRow, ElText, ElInput } from 'element-plus'
const props = defineProps<{
  data: {
    book: acRecord
    wp: workParam
  }
}>()
const book = computed(() => {
  let arr = Array.from(Object.entries(JSON.parse(props.data.book.origin_data)))
  if (search.value) arr = arr.filter(el => el[0].includes(search.value!))
  return arr
})
const workparams = computed(() => {
  let arr = Array.from(Object.entries(JSON.parse(props.data.wp.origin_data)))
  if (search.value) arr = arr.filter(el => el[0].includes(search.value!))
  return arr
})
const container = ref<HTMLElement>()
onMounted(() => {
  container.value?.addEventListener('wheel', (e) => {
    e.stopPropagation()
  })
})
const search = ref<string>()
</script>
