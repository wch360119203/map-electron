import { ElMessage } from 'element-plus'
import { workParam, workParamInput } from '.'
import { connectDB } from '../DB'
import { Knex } from 'knex'
import { Observer } from '@wuch96/utils'
export class WorkParam {
  static instance = new WorkParam()
  observer = new Observer<{ inserted(): void }>()
  protected allDataCache?: workParam[]
  private constructor() {
    this.observer.on('inserted', () => {
      this.allDataCache = undefined
      this.communityMapCache = undefined
    })
  }
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
      updateCount = 0,
      failCount = 0
    await db
      .transaction(async (trx) => {
        const list = forInsert.map((item) =>
          trx('work_param')
            .insert(item)
            .then(() => successCount++)
            .catch(() => {
              return trx('work_param')
                .where('eNodeBID_CellID', '=', item.eNodeBID_CellID!)
                .update(item)
                .then(() => {
                  updateCount++
                })
                .catch(() => {
                  failCount++
                })
            }),
        )
        await Promise.allSettled(list).finally(() => {
          trx.commit()
          this.observer.dispatch('inserted')
        })
      })
      .finally(() => {
        let msg = `成功导入${successCount}条`
        if (updateCount > 0) msg += `,更新${updateCount}条`
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
        .where('eNodeBID_CellID', '=', id)
        .finally(() => {
          autoDes && db.destroy()
        })
    )[0]
    if (!target) throw new Error('不存在对应的工参')
    return target
  }
  async delById(id: string, db: Knex = connectDB(), autoDes = true) {
    return await db('work_param')
      .where('eNodeBID_CellID', '=', id)
      .delete()
      .then(() => {
        this.observer.dispatch('inserted')
      })
      .finally(() => {
        autoDes && db.destroy()
      })
  }
  async selectAll(db: Knex = connectDB(), autoDes = true) {
    if (this.allDataCache !== undefined) {
      if (autoDes) db.destroy()
      return this.allDataCache
    }
    const res = await db
      .select('*')
      .from('work_param')
      .finally(() => {
        autoDes && db.destroy()
      })
    this.allDataCache = res
    return res
  }
  async selectPg(page = 1, size = 10) {
    const offset = page * size - size
    const db = connectDB()
    const query = db.select('*').offset(offset).limit(size).from('work_param')
    return await query.finally(() => {
      db.destroy()
    })
  }
  async count() {
    const db = connectDB()
    const res = await db('work_param')
      .count()
      .finally(() => {
        db.destroy()
      })
    const count = (res[0]?.['count(*)'] as number) ?? 0
    return count
  }
  async deleteAll() {
    const db = connectDB()
    return db
      .transaction((trx) => {
        trx('account_book')
          .update({ wpid: null })
          .then(() => trx('work_param').truncate())
          .then(trx.commit)
          .catch(trx.rollback)
      })
      .finally(() => {
        db.destroy()
      })
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
  private communityMapCache?: Map<string, workParam>
  async getCommunityMap() {
    if (this.communityMapCache) return this.communityMapCache
    const data = await this.selectAll()
    return (this.communityMapCache = new Map(
      data.map((el) => [el.community_name, el]),
    ))
  }
}
