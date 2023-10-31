export interface acRecord extends baseRecord {
  community_id: string
  community_name: string
  '65_overload_date': number
  '7d_avg_availability': number
  is_resolved: number
}

export interface bookRecords {
  rid: number
  name: string
  operator: string
  update_date: number
  date: number
}

/**工参表 */
export interface workParam extends workParamInput {
  update_date: number
  is_remove: number
  origin_data: string
}

export interface workParamInput {
  eNodeBID_CellID: string
  community_name: string
  lat: number
  lng: number
  rotate: number
  operator: string
  site_type: string
  device_type: string
}

export interface baseRecord {
  update_date: number // 写入数据库的时间
  valid_date: number // 用户选择的时间
  is_remove: number
  origin_data: string
  rid: number
  wpid?: string
  id: number
}

export interface poi {
  id: number
  name: string
  geojson: string
  remark?: string
  update_date: number
}
