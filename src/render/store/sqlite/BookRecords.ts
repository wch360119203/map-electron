import { bookRecords } from '.'
import { connectDB } from '../DB'

export class BookRecords {
  static instance = new BookRecords()
  private constructor() {}
  async insert(data: Omit<bookRecords, 'rid' | 'update_date'>[]) {
    const db = connectDB()
    data.forEach((el) => {
      // @ts-ignore
      el.update_date = new Date().valueOf()
    })
    const ret = await new Promise<Pick<bookRecords, 'rid'>[]>((res) => {
      const ret = db
        .insert(data, 'rid')
        .into('book_records')
        .finally(async () => {
          await db.destroy()
        })
      res(ret)
    })
    if (typeof ret[0].rid !== 'number') throw new Error()
    return ret
  }
}
