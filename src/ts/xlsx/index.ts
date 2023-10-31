import * as XLSX from 'xlsx'
import { selectSheet } from './selectSheet'
import { parseAccountBook, parsePoi, parseWorkParam } from './parse'
import { BookRecords, AccountBook, WorkParam, Poi } from '@/render/store'

type fileType = 'accountBook' | 'workParams' | 'poi'

export async function execElsx(
  data: ArrayBuffer,
  filename: string,
  type: fileType,
) {
  const workbook = XLSX.read(data, { type: 'array' })
  const list = Array<Promise<any>>()
  if (type === 'accountBook') {
    const {
      checkList: sheetNames,
      date,
      operator,
    } = await selectSheet(workbook, filename, {
      needDate: true,
      needOperator: true,
    })
    const { rid } = (
      await BookRecords.instance.insert([
        {
          name: filename.replace(/\.\w+$/, ''),
          date: date.valueOf(),
          operator,
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
    return
  }
  if (type === 'workParams') {
    const { checkList: sheetNames } = await selectSheet(workbook, filename, {
      needDate: false,
      needOperator: false,
    })
    sheetNames.forEach((sheetname) => {
      list.push(
        (async () => {
          const sheet = workbook.Sheets[sheetname]
          const { json, fieldDict } = parseWorkParam(sheet)
          await WorkParam.instance.insert(json, fieldDict)
        })(),
      )
    })
  }
  if (type === 'poi') {
    const { checkList: sheetNames } = await selectSheet(workbook, filename, {
      needDate: false,
      needOperator: false,
    })
    sheetNames.forEach((sheetname) => {
      list.push(
        (async () => {
          const sheet = workbook.Sheets[sheetname]
          const json = parsePoi(sheet)
          Poi.instance.insert(
            json.map((el) => ({ name: el[0], geojson: el[1] })),
          )
        })(),
      )
    })
  }
  await Promise.all(list)
}
