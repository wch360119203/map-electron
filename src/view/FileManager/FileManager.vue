<template>
  <ElRow justify="center" class="full-screen padding8">
    <div>
      <div>
        <el-button :icon="Back" type="primary" circle @click="router.push({ name: 'home' })" />
      </div>
      <h1>台账记录</h1>
      <ElTable :data="book">
        <ElTableColumn prop="name" width="380px" label="文件名"></ElTableColumn>
        <ElTableColumn prop="operator" width="80px" label="运营商"></ElTableColumn>
        <ElTableColumn width="170px" label="生效日期">
          <template #default=scope>{{ format(scope.row.date) }}</template>
        </ElTableColumn>
        <ElTableColumn width="170px" label="上传日期">
          <template #default=scope>{{ format(scope.row.update_date) }}</template>
        </ElTableColumn>
        <ElTableColumn width="200" label="操作">
          <template #default=scope>
            <el-popconfirm title="删除后不可恢复!" @confirm="delBook(scope.row.rid)">
              <template #reference>
                <el-button>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </ElTableColumn>
      </ElTable>
      <WorkParamList></WorkParamList>
      <PoiList></PoiList>
    </div>
  </ElRow>
</template>
<script setup lang="ts">
import { Back } from '@element-plus/icons-vue'
import { router } from '@/render'
import { BookRecords, bookRecords } from '@/render/store'
import { onMounted, onUnmounted, ref } from 'vue';
import dayjs from 'dayjs';
import PoiList from './PoiList.vue';
import WorkParamList from './WorkParamList.vue';
const book = ref<bookRecords[]>([])
function getAllRecord() {
  BookRecords.instance.select().then(val => { book.value = val })
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
BookRecords.instance.observer.on('insert', getAllRecord, rmSymbol)
onUnmounted(() => {
  BookRecords.instance.observer.offBySymbol(rmSymbol)
})
</script>
