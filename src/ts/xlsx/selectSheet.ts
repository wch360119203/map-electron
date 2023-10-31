import * as XLSX from 'xlsx'
import { ElMessageBox } from 'element-plus'
import SelectSheetVue from './SelectSheet.vue'
import { h } from 'vue'
export async function selectSheet(
  workbook: XLSX.WorkBook,
  name: string,
  opt: { needDate: boolean; needOperator: boolean },
) {
  let checkList = Array<string>(),
    date: number,
    operator: string
  return await new Promise<{
    checkList: string[]
    date: number
    operator: string
  }>((res, rej) => {
    ElMessageBox.confirm(
      h(SelectSheetVue, {
        workbook,
        needDate: opt.needDate,
        needOperate: opt.needOperator,
        onChecked: (list: string[], d: number, operator1: string) => {
          checkList = list
          date = d
          operator = operator1
        },
      }),
      name,
      {
        showClose: false,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      },
    )
      .then(() => res({ checkList, date, operator }))
      .catch(rej)
  })
}
