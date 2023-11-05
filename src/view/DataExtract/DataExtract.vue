<template>
  <ElRow justify="center" class="full-screen padding8">
    <div>
      <div style="display: flex;">
        <span style="flex-grow: 1;">
          <el-button :icon="Back" type="primary" circle @click="router.push({ name: 'home' })" />
        </span>
        <ElButton color="#815c94" @click="outputExcel">输出Excel</ElButton>
      </div>
      <div>
        <ElRow style="gap: 16px;" align="middle">
          <h1>联通原表</h1>
          <LoadFiles @loadend="unicomLoad" accept=".xlsx">
            <ElButton type="primary" size="small">上传</ElButton>
          </LoadFiles>
          <ElTable :data="unicomData" width="70vw">
            <ElTableColumn prop="fileName" label="文件名"></ElTableColumn>
            <ElTableColumn prop="sheetName" label="sheet名"></ElTableColumn>
            <ElTableColumn prop="extractCount" label="提取数"></ElTableColumn>
          </ElTable>
        </ElRow>
        <ElRow style="gap: 16px;" align="middle">
          <h1>电信原表</h1>
          <LoadFiles @loadend="telecomLoad" accept=".xlsx">
            <ElButton type="primary" size="small">上传</ElButton>
          </LoadFiles>
          <ElTable :data="telecomData" width="70vw">
            <ElTableColumn prop="fileName" label="文件名"></ElTableColumn>
            <ElTableColumn prop="sheetName" label="sheet名"></ElTableColumn>
            <ElTableColumn prop="extractCount" label="提取数"></ElTableColumn>
          </ElTable>
        </ElRow>
      </div>
    </div>
  </ElRow>
</template>
<script setup lang="ts">
import { Back } from '@element-plus/icons-vue'
import { router } from '@/render'
import LoadFiles from '@/component/LoadFiles.vue'
import { combineOutput, readExcel } from '@/ts/dataExtract'
import { ref, toRaw } from 'vue';
const unicomData = ref<{
  fileName: string,
  sheetName: string,
  extractCount: number,
  data: PickMapValue<ReturnType<typeof readExcel>>
}[]>([])
const telecomData = ref<{
  fileName: string,
  sheetName: string,
  extractCount: number,
  data: PickMapValue<ReturnType<typeof readExcel>>
}[]>([])
function unicomLoad(payload: { result: ArrayBuffer, name: string }) {
  const extractMap = readExcel(payload.result)
  for (const [sheetName, val] of extractMap.entries()) {
    unicomData.value.push({
      fileName: payload.name,
      sheetName,
      extractCount: val.size,
      data: val
    })
  }
}
function telecomLoad(payload: { result: ArrayBuffer, name: string }) {
  const extractMap = readExcel(payload.result)
  for (const [sheetName, val] of extractMap.entries()) {
    telecomData.value.push({
      fileName: payload.name,
      sheetName,
      extractCount: val.size,
      data: val
    })
  }
}
function outputExcel() {
  combineOutput([
    ...toRaw(unicomData.value).map(el => ({ operator: '联通', data: el.data })),
    ...toRaw(telecomData.value).map(el => ({ operator: '电信', data: el.data }))
  ])
}
</script>