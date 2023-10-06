import { wpRecords } from '.'
import { connectDB } from '../DB'

export class WpRecords {
  static instance = new WpRecords()
  private constructor() {}
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
    return ret
  }
}
