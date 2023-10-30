<template>
  <ElRow justify="center" class="full-screen padding8">
    <div>
      <div>
        <el-button :icon="Back" type="primary" circle @click="router.push({ name: 'home' })" />
      </div>
      <h1>台账记录</h1>
      <ElTable :data="book">
        <ElTableColumn prop="name" width="300px" label="文件名"></ElTableColumn>
        <ElTableColumn width="200px" label="生效日期">
          <template #default=scope>{{ format(scope.row.date) }}</template>
        </ElTableColumn>
        <ElTableColumn width="200px" label="上传日期">
          <template #default=scope>{{ format(scope.row.update_date) }}</template>
        </ElTableColumn>
        <ElTableColumn width="200px" label="操作">
          <template #default=scope>
            <el-popconfirm title="删除后不可恢复!" @confirm="delBook(scope.row.rid)">
              <template #reference>
                <el-button>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </ElTableColumn>
      </ElTable>
      <h1>重点场景</h1>
      <ElTable :data="poiList">
        <ElTableColumn prop="name" width="300px" label="场景名称"></ElTableColumn>
        <ElTableColumn width="200px" label="上传日期">
          <template #default=scope>{{ format(scope.row.update_date) }}</template>
        </ElTableColumn>
        <ElTableColumn width="200px" label="操作">
          <template #default=scope>
            <el-popconfirm title="删除后不可恢复!" @confirm="Poi.instance.delete(scope.row.id).then(getAllRecord)">
              <template #reference>
                <el-button>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </ElRow>
</template>
<script setup lang="ts">
import { Back } from '@element-plus/icons-vue'
import { router } from '@/render'
import { BookRecords, bookRecords, poi, Poi } from '@/render/store'
import { onMounted, onUnmounted, ref } from 'vue';
import dayjs from 'dayjs';
const book = ref<bookRecords[]>([])
const poiList = ref<poi[]>([])
function getAllRecord() {
  BookRecords.instance.select().then(val => { book.value = val })
  Poi.instance.select().then(val => { poiList.value = val })
}
onMounted(async () => {
  getAllRecord()
})
function format(num: number) {
  return dayjs(num).format('YYYY/MM/DD HH:mm:ss')
}
function delBook(rid: number) {
  BookRecords.instance.delete(rid).then(getAllRecord)
}

const rmSymbol = Symbol()
Poi.instance.observer.on('insert', getAllRecord, rmSymbol)
BookRecords.instance.observer.on('insert', getAllRecord, rmSymbol)
onUnmounted(() => {
  Poi.instance.observer.offBySymbol(rmSymbol)
  BookRecords.instance.observer.offBySymbol(rmSymbol)
})
</script>
