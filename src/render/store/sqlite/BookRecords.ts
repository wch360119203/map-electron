import { bookRecords } from '.'
import { db } from '../DB'

export class BookRecords {
  static instance = new BookRecords()
  db
  private constructor() {
    this.db = db<bookRecords>('book_records')
  }
  async insert(data: Omit<bookRecords, 'rid' | 'update_date'>[]) {
    data.forEach((el) => {
      // @ts-ignore
      el.update_date = new Date().valueOf()
    })
    return await this.db.insert(data)
  }
}
