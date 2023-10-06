import * as XLSX from 'xlsx'
import { selectSheet } from './selectSheet'
import { parseAccountBook, parseWorkParam } from './parse'
import { BookRecords, AccountBook, WpRecords, WorkParam } from '@/render/store'

export type fileType = 'accountBook' | 'workParams'

export async function execElsx(
  data: ArrayBuffer,
  filename: string,
  type: fileType,
) {
  const workbook = XLSX.read(data, { type: 'array' })
  const { checkList: sheetNames, date } = await selectSheet(workbook, filename)
  const list = Array<Promise<any>>()
  
  switch (type) {
    case 'accountBook':
      const { rid } = (
        await BookRecords.instance.insert([
          {
            name: filename.replace(/\.\w+$/, ''),
            date: date.valueOf(),
          },
        ])
      )[0]
      sheetNames.forEach((sheetname) => {
        list.push(
          (async () => {
            const sheet = workbook.Sheets[sheetname]
            const { json, fieldDict } = parseAccountBook(sheet)
            await AccountBook.instance.insert(
              json,
              fieldDict,
              rid,
              date.valueOf(),
            )
          })(),
        )
      })
      break
    default:
      const { id } = (
        await WpRecords.instance.insert([
          {
            name: filename.replace(/\.\w+$/, ''),
            date: date.valueOf(),
          },
        ])
      )[0]
      sheetNames.forEach((sheetname) => {
        list.push(
          (async () => {
            const sheet = workbook.Sheets[sheetname]
            const { json, fieldDict } = parseWorkParam(sheet)
            await WorkParam.instance.insert(json, fieldDict, id, date.valueOf())
          })(),
        )
      })
      break
  }
  await Promise.all(list)
}
