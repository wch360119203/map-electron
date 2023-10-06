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
  async select() {
    const db = connectDB()
    const ret = await db
      .select('*')
      .from('book_records')
      .orderBy('date', 'desc')
      .finally(() => {
        db.destroy()
      })
    return ret
  }
}
