<template>
  <ElRow align="middle">
    <h1 style="margin-right: 20px;">重点场景</h1>
    <ElButton size="small" type="warning" @click="Poi.instance.deleteAll().then(getValue)">删除全部</ElButton>
  </ElRow>
  <ElTable :data="poiList">
    <ElTableColumn prop="id" width="100px" label="id"></ElTableColumn>
    <ElTableColumn prop="name" width="300px" label="场景名称"></ElTableColumn>
    <ElTableColumn width="200px" label="上传日期">
      <template #default=scope>{{ format(scope.row.update_date) }}</template>
    </ElTableColumn>
    <ElTableColumn width="200px" label="操作">
      <template #default=scope>
        <el-popconfirm title="删除后不可恢复!" @confirm="Poi.instance.delete(scope.row.id).then(getValue)">
          <template #reference>
            <el-button>删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </ElTableColumn>
  </ElTable>
  <ElRow justify="center">
    <ElPagination v-model:current-page="currentPg" layout="prev, pager, next" :total="total" />
  </ElRow>
</template>
<script setup lang="ts">
import { poi, Poi } from '@/render/store'
import { onMounted, onUnmounted, ref, watch } from 'vue';
import dayjs from 'dayjs';
const poiList = ref<poi[]>([])
const currentPg = ref(1)
const total = ref(1)
onMounted(() => {
  getValue()
})
watch(currentPg, () => {
  getValue()
})
function getValue() {
  Poi.instance.selectPg(currentPg.value).then(val => { poiList.value = val })
  Poi.instance.count().then(n => {
    total.value = n
  })
}
function format(num: number) {
  return dayjs(num).format('YYYY/MM/DD HH:mm:ss')
}
const rmSymbol = Symbol()
Poi.instance.observer.on('insert', getValue, rmSymbol)
onUnmounted(() => {
  Poi.instance.observer.offBySymbol(rmSymbol)
})
</script>