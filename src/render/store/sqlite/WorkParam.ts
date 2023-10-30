import { ElMessage } from 'element-plus'
import { workParam, workParamInput } from '.'
import { connectDB } from '../DB'
import { Knex } from 'knex'
export class WorkParam {
  static instance = new WorkParam()
  private constructor() {}
  async insert(
    json: Record<string, any>[],
    fieldDict: Record<keyof workParamInput, string>,
  ) {
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
        item.site_type = el[fieldDict.site_type]
        item.device_type = el[fieldDict.device_type]
        item.rotate = el[fieldDict.rotate]
        item.update_date = updateDate
        return item
      })
    let successCount = 0,
      failCount = 0
    const list = forInsert.map((item) =>
      db
        .upsert(item)
        .into('work_param')
        .then(() => successCount++)
        .catch(() => failCount++),
    )
    await Promise.allSettled(list).finally(() => {
      let msg = `成功导入${successCount}条`
      if (failCount > 0) msg += `,失败${failCount}条`
      ElMessage({
        type: failCount > 0 ? 'warning' : 'success',
        message: msg,
      })

      db.destroy()
    })
  }
  async selectById(id: string, db: Knex = connectDB(), autoDes = true) {
    const target = (
      await db
        .select('*')
        .from('work_param')
        .where('id', '=', id)
        .finally(() => {
          autoDes && db.destroy()
        })
    )[0]
    if (!target) throw new Error('不存在对应的工参')
    return target
  }
  async selectByCommunityName(
    cname: string,
    date: number,
    db: Knex = connectDB(),
    autoDes = true,
  ) {
    const target = (
      await db
        .select('*')
        .from('work_param')
        .where('valid_date', '<=', date)
        .andWhere('community_name', '=', cname)
        .orderBy('valid_date', 'desc')
        .limit(1)
        .finally(() => autoDes && db.destroy())
    )[0]
    if (!target) throw new Error('不存在对应的工参')
    return target
  }
}
