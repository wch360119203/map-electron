import { Observer } from '@wuch96/utils'
import { poi } from '.'
import { connectDB } from '../DB'
import { ElMessage } from 'element-plus'
export class Poi {
  static instance = new Poi()
  private constructor() {}
  observer = new Observer<{
    insert: (ids: number[]) => void
  }>()
  async insert(json: Omit<poi, 'id' | 'update_date'>[]) {
    const db = connectDB()
    const data = json.map((el) => ({
      ...el,
      update_date: new Date().valueOf(),
    }))
    const ids = Array<number>(data.length)
    let successCount = 0,
      failCount = 0
    await db
      .transaction(async (trx) => {
        const list = data.map((el, index) =>
          trx('poi')
            .insert(el, 'id')
            .then((id) => {
              if (typeof id[0].id !== 'number') throw new Error()
              ids[index] = id[0].id
              successCount++
            })
            .catch(() => {
              failCount++
            }),
        )
        await Promise.allSettled(list).finally(() => {
          trx.commit()
        })
      })
      .finally(() => {
        let msg = `成功导入${successCount}条`
        if (failCount > 0) msg += `,失败${failCount}条`
        ElMessage({
          type: failCount > 0 ? 'warning' : 'success',
          message: msg,
        })
        db.destroy()
      })
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
  async selectPg(page = 1, size = 10) {
    const offset = page * size - size
    const db = connectDB()
    const query = db.select('*').offset(offset).limit(size).from('poi')
    return await query.orderBy('id', 'desc').finally(() => {
      db.destroy()
    })
  }
  async count() {
    const db = connectDB()
    const res = await db('poi')
      .count()
      .finally(() => {
        db.destroy()
      })
    const count = (res[0]?.['count(*)'] as number) ?? 0
    return count
  }
  deleteAll() {
    const db = connectDB()
    return db('poi')
      .truncate()
      .finally(() => {
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
