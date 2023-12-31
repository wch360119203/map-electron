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
  site_type: /站点类型/,
  device_type: /设备分类/,
}

export const dataExtractRegExp = {
  date: [/日期/, /结束时间/],
  communityName: /小区名称/,
  downPrb: /下行(业务信息)?PRB/i,
}

export function matchHeader(headers: string[], reg: RegExp | RegExp[]) {
  let count = 0
  let ret!: string
  for (let i = 0; i < headers.length; i++) {
    const str = headers[i]
    if (Array.isArray(reg)) {
      for (const r of reg) {
        if(r.test(str)){
          ret = str
          count++
          break
        }
      }
    } else if (reg.test(str)) {
      ret = str
      count++
    }
  }
  if (count > 1 || count == 0) {
    const msg = `解析xlsx失败:${reg.toString()}匹配到${count}个`
    ElMessage({
      type: 'error',
      message: msg,
    })
    console.warn(msg)
    throw new Error('')
  }
  return ret
}
