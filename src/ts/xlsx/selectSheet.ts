import * as XLSX from 'xlsx'
import { ElMessageBox } from 'element-plus'
import SelectSheetVue from './SelectSheet.vue'
import { h } from 'vue'
export async function selectSheet(workbook: XLSX.WorkBook, name: string) {
  let checkList = Array<string>(),
    date: number
  return await new Promise<{ checkList: string[]; date: number }>(
    (res, rej) => {
      ElMessageBox.confirm(
        h(SelectSheetVue, {
          workbook,
          onChecked: (list: string[], d: number) => {
            checkList = list
            date = d
          },
        }),
        name,
        {
          showClose: false,
          confirmButtonText: '确认',
          cancelButtonText: '取消',
        },
      )
        .then(() => res({ checkList, date }))
        .catch(rej)
    },
  )
}
