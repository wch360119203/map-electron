import { acRecord, baseRecord } from '@/render/store'
import { connectDB } from '../DB'
import { excelTime2JsTime } from '@/ts/utils'
export class AccountBook {
  static instance = new AccountBook()
  private constructor() {
    // this.db = db<acRecord>('account_book')
  }
  async insert(
    json: Record<string, any>[],
    fieldDict: Record<OmitKey<acRecord, baseRecord>, string>,
    rid: number,
  ) {
    const db = connectDB()
    const updateDate = new Date().valueOf()
    const forInsert = json.map((el) => {
      const item: Partial<acRecord> = {}
      item['65_overload_date'] = excelTime2JsTime(
        el[fieldDict['65_overload_date']],
      ).valueOf()
      item['7d_avg_availability'] = el[fieldDict['7d_avg_availability']]
      item.community_id = el[fieldDict.community_id]
      item.community_name = el[fieldDict.community_name]
      item.is_resolved = /是/.test(el[fieldDict.is_resolved]) ? 1 : 0 // 是为1 否为0

      item.is_remove = 0
      item.origin_data = JSON.stringify(el)
      item.rid = rid
      item.update_date = updateDate
      return item as acRecord
    })
    return await new Promise<number[]>((res) => {
      let ret: number[]
      db.insert(forInsert)
        .into('account_book')
        .then((r) => {
          ret = r
        })
        .finally(async () => {
          await db.destroy()
          res(ret ?? [])
        })
    })
  }
}
