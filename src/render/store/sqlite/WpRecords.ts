import { Observer } from '@wuch96/utils'
import { wpRecords } from '.'
import { connectDB } from '../DB'

export class WpRecords {
  static instance = new WpRecords()
  observer = new Observer<{
    insert: (rid: number) => void
  }>()
  private constructor() {}
  async select() {
    const db = connectDB()
    const ret = await db
      .select('*')
      .from('wp_records')
      .orderBy('date', 'desc')
      .finally(() => {
        db.destroy()
      })
    return ret
  }
  async insert(data: Omit<wpRecords, 'id' | 'update_date'>[]) {
    const db = connectDB()
    data.forEach((el) => {
      // @ts-ignore
      el.update_date = new Date().valueOf()
    })
    const ret = await db
      .insert(data, 'id')
      .into('wp_records')
      .finally(() => {
        db.destroy()
      })
    if (typeof ret[0].id !== 'number') throw new Error()
    this.observer.dispatch('insert', ret[0].id)
    return ret
  }
  /**根据rid删除，会连锁删除work_param中的记录 */
  async delete(rid: number) {
    if (typeof rid !== 'number') throw new TypeError()
    const db = connectDB()
    return await db
      .transaction(function (trx) {
        db.from('wp_records')
          .transacting(trx)
          .where('id', '=', rid)
          .del()
          .then(() =>
            db('work_param').transacting(trx).where('rid', '=', rid).del(),
          )
          .then(trx.commit)
          .catch(trx.rollback)
      })
      .catch(console.error)
      .finally(() => db.destroy())
  }
}
