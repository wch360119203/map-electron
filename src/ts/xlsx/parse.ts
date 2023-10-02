import * as XLSX from 'xlsx'
import { acRecord, baseRecord } from '@/render/store'
import { matchHeader, accountbookRegExp } from './fieldRegExp'
export function parseAccountBook(sheet: XLSX.WorkSheet, sheetName: string) {
  const header = getHeader(sheet)
  const fieldDict = execAcField(header)
  const json = XLSX.utils.sheet_to_json<Record<string, any>>(sheet)
  return {
    json,
    fieldDict,
    header,
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
    if (cell.t == 's') {
      ret.push(cell.w as string)
    }
  }
  return ret
}
