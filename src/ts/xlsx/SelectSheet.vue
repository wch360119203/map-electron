<template>
  <div v-show="props.needOperate">
    运营商:
    <ElRadioGroup v-model="operator">
      <ElRadio label="电信"></ElRadio>
      <ElRadio label="联通"></ElRadio>
    </ElRadioGroup>
  </div>
  <div v-show="props.needDate">
    生效日期:
    <ElDatePicker v-model="datePicker"></ElDatePicker>
  </div>
  <ElDivider v-show="props.needDate || props.needOperate"></ElDivider>
  <div>sheet选择:</div>
  <div>
    <ElCheckboxGroup v-model="checkList">
      <ElCheckbox v-for="(item, index) in sheetNames" :key="index" :label="item"></ElCheckbox>
    </ElCheckboxGroup>
  </div>
</template>
<script setup lang="ts">
import * as XLSX from 'xlsx'
import { ref, toRaw, watch } from 'vue'
import { dayjs } from 'element-plus'
const props = defineProps<{
  workbook: XLSX.WorkBook
  needDate: boolean
  needOperate: boolean
}>()
const operator = ref('电信')
const { workbook } = props
const sheetNames = ref(workbook.SheetNames)
const checkList = ref<string[]>([])
const datePicker = ref<number>(dayjs().startOf('day').valueOf())
watch([operator, datePicker, checkList], emitFn)
const emits = defineEmits<{
  (e: 'checked', list: string[], d: number, operator: string): void
}>()

if (workbook.SheetNames.length === 1) {
  checkList.value = workbook.SheetNames
  emitFn()
}
function emitFn() {
  emits('checked', toRaw(checkList.value), toRaw(datePicker.value), toRaw(operator.value))
}
</script>
