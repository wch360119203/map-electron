import { readExcel } from '.'
import * as XLSX from 'xlsx'
import { formatDate } from '../utils'
import dayjs from 'dayjs'
export function combineOutput(
  arr: {
    operator: string
    data: PickMapValue<ReturnType<typeof readExcel>>
  }[],
) {
  const json = Array<ReturnType<typeof createRow>>()
  arr.forEach(({ operator, data }) => {
    data.forEach((item) => {
      json.push(
        createRow(operator, item.communityName, item.inTableData, item.avgPrb),
      )
    })
  })
  const sheet = XLSX.utils.json_to_sheet(json)
  const dateStr = dayjs().format('MM/DD_HH:mm')
  XLSX.writeFileXLSX(
    { SheetNames: ['sheet1'], Sheets: { sheet1: sheet } },
    '原表提取' + dateStr + '.xlsx',
    { type: 'file', Props: { Author: '基础地图' }, bookType: 'xlsx' },
  )
}

function createRow(
  operator: string,
  communityName: string,
  inTableData: number,
  avgPrb: number,
) {
  return {
    运营商: operator,
    小区编号: '',
    小区: communityName,
    '65%高负荷入表日期': formatDate(new Date(inTableData)),
    最新利用率: String(avgPrb),
    是否解决: '否',
  }
}
