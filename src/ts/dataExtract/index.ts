import * as XLSX from 'xlsx'
import { dataExtractRegExp, matchHeader } from '../xlsx/fieldRegExp'
import { getNearlyThursday } from '../utils'
export * from './combineOutput'
export function readExcel(data: ArrayBuffer) {
  const workbook = XLSX.read(data, { type: 'array' })
  const sheetMap = new Map<string, ReturnType<typeof execJson>>()
  for (const [sheetName, sheet] of Object.entries(workbook.Sheets)) {
    const headers = getHead(sheet)
    let headDict: Record<'data' | 'communityName' | 'prb', string>
    try {
      headDict = {
        data: matchHeader(headers, dataExtractRegExp.date),
        communityName: matchHeader(headers, dataExtractRegExp.communityName),
        prb: matchHeader(headers, dataExtractRegExp.downPrb),
      }
    } catch (error) {
      continue
    }
    const json = XLSX.utils.sheet_to_json(sheet)
    sheetMap.set(sheetName, execJson(json, headDict))
  }
  return sheetMap
}
interface resultExObj {
  inTableData: number
  communityName: string
  allTime: number
  overloadTime: number
  avgPrb: number
}
function execJson(
  json: any[],
  headDict: Record<'data' | 'communityName' | 'prb', string>,
) {
  const maxPrb = Math.max(...json.map((el) => el[headDict.prb] as number))
  const exJson = json.map((el) => {
    let prb = el[headDict.prb] as number
    if (maxPrb > 1) prb /= 100
    const communityName = el[headDict.communityName]
    return {
      data: new Date(el[headDict.data]).valueOf(),
      communityName,
      prbDown: prb,
    }
  })
  const map = new Map<string, resultExObj>()
  exJson.forEach(addObj)
  for (const item of map.values()) {
    if (item.avgPrb < 0.7) {
      map.delete(item.communityName)
      continue
    }
    if (item.allTime >= 7 && item.overloadTime < 4) {
      map.delete(item.communityName)
    }
  }
  return map
  function addObj(el: PickFromArr<typeof exJson>) {
    if (!map.has(el.communityName)) {
      map.set(el.communityName, {
        inTableData: el.data,
        communityName: el.communityName,
        allTime: 1,
        overloadTime: el.prbDown >= 0.65 ? 1 : 0,
        avgPrb: el.prbDown,
      })
    } else {
      const target = map.get(el.communityName)!
      target.inTableData = getNearlyThursday(target.inTableData)
      target.allTime++
      if (el.prbDown >= 0.65) target.overloadTime++
      target.avgPrb =
        target.avgPrb * (1 - 1 / target.allTime) + el.prbDown / target.allTime
    }
  }
}
function getRange(sheet: XLSX.WorkSheet) {
  const ref = sheet['!ref']
  if (!ref) throw new Error('获取range失败')
  return XLSX.utils.decode_range(ref)
}
function getHead(sheet: XLSX.WorkSheet) {
  const headers = Array<string>()
  const range = getRange(sheet)
  const startCol = range.s.c,
    endCol = range.e.c
  for (let i = startCol; i <= endCol; i++) {
    const colStr = XLSX.utils.encode_col(i)
    const head = sheet[colStr + '1'].w
    headers[i] = head
  }
  return headers
}
