import { connectDB } from '../DB'

export class Underlay {
  static instance = new Underlay()
  private constructor() {}
  async select() {
    const db = connectDB()
    const query = db.select('*').from('underlay')
    return query.orderBy('id', 'desc').finally(() => {
      db.destroy()
    })
  }
}
