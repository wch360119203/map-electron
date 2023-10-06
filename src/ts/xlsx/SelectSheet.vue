<template>
  <div>
    日期选择:
    <ElDatePicker v-model="datePicker"></ElDatePicker>
  </div>
  <ElDivider></ElDivider>
  <div>sheet选择:</div>
  <div>
    <ElCheckboxGroup
      v-model="checkList"
      @change="emits('checked', toRaw(checkList), toRaw(datePicker))"
    >
      <ElCheckbox
        v-for="(item, index) in sheetNames"
        :key="index"
        :label="item"
      ></ElCheckbox>
    </ElCheckboxGroup>
  </div>
</template>
<script setup lang="ts">
import * as XLSX from 'xlsx'
import { ref, toRaw } from 'vue'
import { dayjs } from 'element-plus'
const props = defineProps<{
  workbook: XLSX.WorkBook
}>()
const { workbook } = props
const sheetNames = ref(workbook.SheetNames)
const checkList = ref<string[]>([])
const datePicker = ref<number>(dayjs().startOf('day').valueOf())
const emits = defineEmits<{
  (e: 'checked', list: string[], d: number): void
}>()

if (workbook.SheetNames.length === 1) {
  checkList.value = workbook.SheetNames
  emits('checked', toRaw(checkList.value), toRaw(datePicker.value))
}
</script>
