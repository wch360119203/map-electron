import * as XLSX from 'xlsx'
import { selectSheet } from './selectSheet'
import { parseAccountBook } from './parse'
import { accountBookWrite } from './accountBook'

export type fileType = 'accountBook' | 'workParams'

export async function execElsx(
  data: ArrayBuffer,
  name: string,
  type: fileType,
) {
  const workbook = XLSX.read(data, { type: 'array' })
  const { checkList: sheetNames, date } = await selectSheet(workbook, name)
  switch (type) {
    case 'accountBook':
      sheetNames.forEach((name) => {
        const sheet = workbook.Sheets[name]
        const { json, fieldDict } = parseAccountBook(sheet, name)
        accountBookWrite(json, fieldDict)
      })
      break

    default:
      break
  }
  console.log(workbook, sheetNames)
}
