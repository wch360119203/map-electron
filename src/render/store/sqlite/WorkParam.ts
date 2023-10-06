import { workParam, workParamInput } from '.'
import { connectDB } from '../DB'
export class WorkParam {
  static instance = new WorkParam()
  private constructor() {}
  async insert(
    json: Record<string, any>[],
    fieldDict: Record<keyof workParamInput, string>,
    rid: number,
  ) {
    console.log(json, fieldDict)
    const db = connectDB()
    const updateDate = new Date().valueOf()
    const forInsert = json
      .filter((el) => el[fieldDict.eNodeBID_CellID] !== undefined)
      .map((el) => {
        const item: Partial<workParam> = {}
        item.origin_data = JSON.stringify(el)
        item.community_name = el[fieldDict.community_name]
        item.eNodeBID_CellID = el[fieldDict.eNodeBID_CellID]
        item.is_remove = 0
        item.lat = el[fieldDict.lat]
        item.lng = el[fieldDict.lng]
        item.operator = el[fieldDict.operator]
        item.rid = rid
        item.rotate = el[fieldDict.rotate]
        item.update_date = updateDate
        return item
      })
    return await new Promise<number[]>((res) => {
      let ret: number[]
      db.insert(forInsert)
        .into('work_param')
        .then((r) => {
          ret = r
        })
        .finally(async () => {
          await db.destroy()
          console.log(forInsert, ret)
          res(ret ?? [])
        })
    })
  }
}
