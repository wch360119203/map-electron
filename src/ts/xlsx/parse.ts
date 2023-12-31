import * as XLSX from 'xlsx'
import { acRecord, baseRecord, workParamInput } from '@/render/store'
import { matchHeader, accountbookRegExp, workParamRegExp } from './fieldRegExp'
import { polygon } from '@turf/helpers'
export function parseAccountBook(sheet: XLSX.WorkSheet) {
  const header = getHeader(sheet)
  const fieldDict = execAcField(header)
  const json = XLSX.utils.sheet_to_json<Record<string, any>>(sheet)
  return {
    json,
    fieldDict,
    header,
  }
}
export function parseWorkParam(sheet: XLSX.WorkSheet) {
  const header = getHeader(sheet)
  const fieldDict = execWpField(header)
  const json = XLSX.utils.sheet_to_json<Record<string, any>>(sheet)
  return {
    json,
    fieldDict,
    header,
  }
}

export function parsePoi(sheet: XLSX.WorkSheet) {
  const json = XLSX.utils.sheet_to_json<Record<string, any>>(sheet)
  return json.map((item) => {
    const ret = Array<string>()
    for (const key of Object.keys(item)) {
      if (key.includes('名称')) {
        ret[0] = item[key]
      } else if (key.includes('经纬度')) {
        ret[1] = string2Polygon(item[key])
      }
    }
    return ret
  })
}

function string2Polygon(str: string): string {
  const arr = str
    .trim()
    .split(' ')
    .map((el) => el.split(',').map((str) => Number(str)))
  return JSON.stringify(polygon([arr]))
}

function execWpField(header: string[]): Record<keyof workParamInput, string> {
  return {
    eNodeBID_CellID: matchHeader(header, workParamRegExp.eNodeBID_CellID),
    community_name: matchHeader(header, workParamRegExp.community_name),
    lat: matchHeader(header, workParamRegExp.lat),
    lng: matchHeader(header, workParamRegExp.lng),
    operator: matchHeader(header, workParamRegExp.operator),
    rotate: matchHeader(header, workParamRegExp.rotate),
    site_type: matchHeader(header, workParamRegExp.site_type),
    device_type: matchHeader(header, workParamRegExp.device_type),
  }
}
function execAcField(
  header: string[],
): Record<OmitKey<acRecord, baseRecord>, string> {
  return {
    community_id: matchHeader(header, accountbookRegExp.community_id),
    community_name: matchHeader(header, accountbookRegExp.community_name),
    '65_overload_date': matchHeader(
      header,
      accountbookRegExp['65_overload_date'],
    ),
    '7d_avg_availability': matchHeader(
      header,
      accountbookRegExp['7d_avg_availability'],
    ),
    is_resolved: matchHeader(header, accountbookRegExp.is_resolved),
  }
}

function getHeader(sheet: XLSX.WorkSheet) {
  const headRef = sheet['!ref']
    ?.split(':')
    .map((el) => /\D+/.exec(el)?.[0]!)
    .map(XLSX.utils.decode_col)
  if (!headRef) throw new Error('')
  const ret = Array<string>()
  for (let i = headRef[0]; i <= headRef[1]; i++) {
    const cell = sheet[`${XLSX.utils.encode_col(i)}1`] as XLSX.CellObject
    if (cell?.t == 's') {
      ret.push(cell.w as string)
    }
  }
  return ret
}
