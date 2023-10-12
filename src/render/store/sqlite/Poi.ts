import { Observer } from '@wuch96/utils'
import { poi } from '.'
import { connectDB } from '../DB'
export class Poi {
  static instance = new Poi()
  private constructor() {}
  observer = new Observer<{
    insert: (ids: { id: number }[]) => void
  }>()
  async insert(json: Omit<poi, 'id' | 'update_date'>[]) {
    const db = connectDB()
    const data = json.map((el) => ({
      ...el,
      update_date: new Date().valueOf(),
    }))
    const ids = await db
      .insert(data, 'id')
      .into('poi')
      .finally(() => db.destroy())
    const id = ids[0].id
    if (typeof id !== 'number') throw new Error()
    this.observer.dispatch('insert', ids)
    return ids
  }
  async select() {
    const db = connectDB()
    const query = db.select('*').from('poi')
    return await query.orderBy('id', 'desc').finally(() => {
      db.destroy()
    })
  }
  delete(id: number) {
    const db = connectDB()
    return db
      .from('poi')
      .where('id', '=', id)
      .delete()
      .finally(() => {
        db.destroy()
      })
  }
}
