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
  update_date: number
  date: number
}

export interface baseRecord {
  update_date: number
  is_remove: number
  origin_data: string
}
