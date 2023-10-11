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
      <h1>工参记录</h1>
      <ElTable :data="workparam">
        <ElTableColumn prop="name" width="300px" label="文件名"></ElTableColumn>
        <ElTableColumn width="200px" label="生效日期">
          <template #default=scope>{{ format(scope.row.date) }}</template>
        </ElTableColumn>
        <ElTableColumn width="200px" label="上传日期">
          <template #default=scope>{{ format(scope.row.update_date) }}</template>
        </ElTableColumn>
        <ElTableColumn width="200px" label="操作">
          <template #default=scope>
            <el-popconfirm title="删除后不可恢复!" @confirm="delWorkParam(scope.row.id)">
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
import { BookRecords, WpRecords, bookRecords, wpRecords } from '@/render/store'
import { onMounted, ref } from 'vue';
import dayjs from 'dayjs';
const book = ref<bookRecords[]>([])
const workparam = ref<wpRecords[]>([])
function getBookRecord() {
  BookRecords.instance.select().then(val => { book.value = val })
  WpRecords.instance.select().then(val => { workparam.value = val })
}
onMounted(async () => {
  getBookRecord()
})
function format(num: number) {
  return dayjs(num).format('YYYY/MM/DD HH:mm:ss')
}
function delBook(rid: number) {
  BookRecords.instance.delete(rid).then(getBookRecord)
}
function delWorkParam(rid: number) {
  WpRecords.instance.delete(rid).then(getBookRecord)
}
</script>
