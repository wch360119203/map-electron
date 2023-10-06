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
    const ret = await new Promise<Pick<wpRecords, 'id'>[]>((res) => {
      const ret = db
        .insert(data, 'id')
        .into('wp_records')
        .finally(async () => {
          await db.destroy()
        })
      res(ret)
    })
    if (typeof ret[0].id !== 'number') throw new Error()
    return ret
  }
}
