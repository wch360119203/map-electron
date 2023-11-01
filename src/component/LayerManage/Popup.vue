<template>
  <span ref="container">
    <ElRow>
      <ElInput v-model="search" size="small" placeholder="筛选字段" :style="{ width: '80px' }"
        style="flex-grow: 1;padding-right: 25px;" />
      <ElButton type="danger" size="small" @click="emits('close')">关闭</ElButton>
    </ElRow>
    <ElScrollbar width="600px" max-height="300px">
      <span v-if="book.length !== 0">
        <ElRow justify="center">
          <ElText type="primary" size="large">台账</ElText>
        </ElRow>
        <ElTable :data="book">
          <el-table-column prop="0" label="" />
          <el-table-column prop="1" label="" width="120" />
        </ElTable>
      </span>
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
import { ElScrollbar, ElTable, ElTableColumn, ElRow, ElText, ElInput, ElButton } from 'element-plus'
import { excelTime2JsTime, formatDate } from '@/ts/utils';
const props = defineProps<{
  data: {
    book: acRecord | null
    wp: workParam
  }
}>()
const emits = defineEmits<{ (e: 'close'): void }>()
const book = computed(() => {
  if (!props.data.book) return []
  let arr = Array.from(Object.entries(JSON.parse(props.data.book.origin_data)))
  arr.forEach((el) => {
    if (el[0].includes('日期') && !Number.isNaN(Number(el[1]))) {
      el[1] = formatDate(excelTime2JsTime(Number(el[1])))
    }
  })
  if (search.value) arr = arr.filter(el => el[0].includes(search.value!))
  return arr
})
const workparams = computed(() => {
  let arr = Array.from(Object.entries(JSON.parse(props.data.wp.origin_data)))
  arr.forEach((el) => {
    if (el[0].includes('日期') && !Number.isNaN(Number(el[1]))) {
      el[1] = formatDate(excelTime2JsTime(Number(el[1])))
    }
  })
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
