import { Observer } from '@wuch96/utils'
import { bookRecords } from '.'
import { connectDB } from '../DB'

export class BookRecords {
  static instance = new BookRecords()
  observer = new Observer<{
    insert: (rid: number) => void
  }>()
  private constructor() {}
  async insert(data: Omit<bookRecords, 'rid' | 'update_date'>[]) {
    const db = connectDB()
    data.forEach((el) => {
      // @ts-ignore
      el.update_date = new Date().valueOf()
    })
    const ret = await db
      .insert(data, 'rid')
      .into('book_records')
      .finally(() => {
        db.destroy()
      })
    if (typeof ret[0].rid !== 'number') throw new Error()
    this.observer.dispatch('insert', ret[0].rid)
    return ret
  }
  /**
   * @param recentDayFilter 最近的天数
   */
  async select(recentDayFilter?: number) {
    const db = connectDB()
    const query = db.select('*').from('book_records')
    if (recentDayFilter !== undefined) {
      const oneday = 24 * 60 * 60 * 1000
      query.where('date', '>=', new Date().valueOf() - oneday * recentDayFilter)
    }
    return await query.orderBy('date', 'desc').finally(() => {
      db.destroy()
    })
  }
  /**根据rid删除，会连锁删除account_book中的记录 */
  async delete(rid: number) {
    if (typeof rid !== 'number') throw new TypeError()
    const db = connectDB()
    return await db
      .transaction(function (trx) {
        db.from('book_records')
          .transacting(trx)
          .where('rid', '=', rid)
          .del()
          .then(() =>
            db('account_book').transacting(trx).where('rid', '=', rid).del(),
          )
          .then(trx.commit)
          .catch(trx.rollback)
      })
      .catch(console.error)
      .finally(() => db.destroy())
  }
}
