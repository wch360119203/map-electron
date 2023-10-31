<template>
  <ElRow align="middle">
    <h1 style="margin-right: 20px;">工参</h1>
    <ElButton size="small" type="warning" @click="WorkParam.instance.deleteAll().then(getValue)">删除全部</ElButton>
  </ElRow>
  <ElTable :data="wpList">
    <ElTableColumn prop="eNodeBID_CellID" label="eNodeBID_CellID" width="100px"></ElTableColumn>
    <ElTableColumn prop="community_name" width="300px" label="小区名"></ElTableColumn>
    <ElTableColumn prop="site_type" width="100px" label="站点类型"></ElTableColumn>
    <ElTableColumn prop="device_type" width="100px" label="设备类型"></ElTableColumn>
    <ElTableColumn width="200px" label="更新日期">
      <template #default=scope>{{ format(scope.row.update_date) }}</template>
    </ElTableColumn>
    <ElTableColumn width="200px" label="操作">
      <template #default=scope>
        <el-popconfirm title="删除后不可恢复!" @confirm="WorkParam.instance.selectById(scope.row.id).then(getValue)">
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
import { workParam, WorkParam } from '@/render/store'
import { onMounted, onUnmounted, ref, watch } from 'vue';
import dayjs from 'dayjs';
const wpList = ref<workParam[]>([])
const currentPg = ref(1)
const total = ref(1)
onMounted(() => {
  getValue()
})
watch(currentPg, () => {
  getValue()
})
const rmSymbol = Symbol()
WorkParam.instance.observer.on('inserted', getValue, rmSymbol)
onUnmounted(() => {
  WorkParam.instance.observer.offBySymbol(rmSymbol)
})
function getValue() {
  WorkParam.instance.selectPg(currentPg.value).then(val => { wpList.value = val })
  WorkParam.instance.count().then(n => {
    total.value = n
  })
}
function format(num: number) {
  return dayjs(num).format('YYYY/MM/DD HH:mm:ss')
}
</script>