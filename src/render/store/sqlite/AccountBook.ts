import { WorkParam, acRecord, baseRecord } from '@/render/store'
import { connectDB } from '../DB'
import { excelTime2JsTime } from '@/ts/utils'
import { ElMessage } from 'element-plus'
import { Knex } from 'knex'
import { Observer } from '@wuch96/utils'
export class AccountBook {
  static instance = new AccountBook()
  observer = new Observer<{ inserted(): void }>()
  private constructor() {
    // this.db = db<acRecord>('account_book')
  }
  async insert(
    json: Record<string, any>[],
    fieldDict: Record<OmitKey<acRecord, baseRecord>, string>,
    rid: number,
    validDate: number,
  ) {
    const db = connectDB()
    const updateDate = new Date().valueOf()
    const forInsert = json
      .filter((el) => el[fieldDict.community_name] != null)
      .map((el) => {
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
        item.valid_date = validDate
        return item as acRecord
      })
    let successCount = 0,
      failCount = 0
    await db
      .transaction(async (trx) => {
        const list = forInsert.map((item) =>
          trx('account_book')
            .insert(item)
            .then(() => successCount++)
            .catch((err) => {
              console.error(err)
              failCount++
            }),
        )
        await Promise.allSettled(list).finally(() => {
          let msg = `成功导入${successCount}条`
          if (failCount > 0) msg += `,失败${failCount}条`
          ElMessage({
            type: failCount > 0 ? 'warning' : 'success',
            message: msg,
          })
          trx.commit()
          this.observer.dispatch('inserted')
        })
      })
      .finally(() => {
        db.destroy()
      })
  }

  async selectByRid(rid: number) {
    const db = connectDB()
    return await db
      .select('*')
      .from('account_book')
      .where('rid', '=', rid)
      .finally(() => {
        db.destroy()
      })
  }
  async updateWpid(
    id: number,
    wpid: string,
    db: Knex = connectDB(),
    autoDes = true,
  ) {
    return await db('account_book')
      .where('id', '=', id)
      .update({ wpid })
      .finally(() => {
        autoDes && db.destroy()
      })
  }
}
/**写入台账的wpid */
export async function writeWpid(
  item: acRecord,
  trx: Knex.Transaction<any, any[]>,
) {
  const communityName = item.community_name
  if (!communityName) throw new Error('社区名称未找到')
  const map = await WorkParam.instance.getCommunityMap()
  const target = map.get(communityName)
  if (!target) throw new Error("匹配失败");
  return {
    p: trx('account_book')
      .where('id', '=', item.id)
      .update({ wpid: target.eNodeBID_CellID })
      .then((e) => e),
    wpid: target.eNodeBID_CellID,
  }
}
