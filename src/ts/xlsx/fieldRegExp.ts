import { ElMessage } from 'element-plus'
import { acRecord, baseRecord, workParamInput } from '@/render/store'

export const accountbookRegExp: Record<
  OmitKey<acRecord, baseRecord>,
  RegExp
> = {
  community_id: /小区编号/,
  community_name: /^小区$/,
  '65_overload_date': /65%高负荷入表/,
  '7d_avg_availability': /最新利用率/,
  is_resolved: /是否解决/,
}

export const workParamRegExp: Record<keyof workParamInput, RegExp> = {
  eNodeBID_CellID: /eNodeBID.*CellID/,
  community_name: /现.*小区名/,
  lat: /纬度/,
  lng: /经度/,
  rotate: /方位角/,
  operator: /运营商/,
}

export function matchHeader(headers: string[], reg: RegExp) {
  let count = 0
  let ret!: string
  for (let i = 0; i < headers.length; i++) {
    const str = headers[i]
    if (reg.test(str)) {
      ret = str
      count++
    }
  }
  if (count > 1 || count == 0) {
    ElMessage({
      type: 'error',
      message: `解析xlsx失败:${reg.toString()}匹配到${count}个`,
    })
    throw new Error('')
  }
  return ret
}
