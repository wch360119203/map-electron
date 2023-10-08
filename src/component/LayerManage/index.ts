import { AccountBook, WorkParam, acRecord, writeWpid } from '@/render/store'
import { connectDB } from '@/render/store/DB'
import { BaseLayer, PointLayer, Scene } from '@antv/l7'
import { Observer } from '@wuch96/utils'
import { bindPopup, createGeojson, createL7Layer } from './createGeojson'
import { ElMessage } from 'element-plus'
export class LayerManager {
  static instance = new LayerManager()
  observer = new Observer<{
    layerChange(acRid: number, isOpened: boolean): void
  }>()
  layers = new Map<number, BaseLayer>()
  scene?: Scene
  private constructor() {
    this.observer.on('layerChange', async (acrid, isopen) => {
      const layer = await this.getLayer(acrid)
      if (isopen) {
        layer.show()
        layer.fitBounds()
      } else {
        layer.hide()
      }
    })
  }
  /**关联scene */
  linkScene(scene: Scene) {
    this.scene = scene
    this.layers.forEach((layer) => {
      scene.addLayer(layer)
      scene.addPopup(bindPopup(layer))
    })
  }
  /**获取图层 */
  async getLayer(rid: number): Promise<BaseLayer> {
    if (!this.layers.has(rid)) {
      const books = await AccountBook.instance.selectByRid(rid)
      const validBooks = (await matchBook(books)).filter(
        (el) => el.wpid != null,
      )
      const layer = await this.createLayer(validBooks)
      if (this.scene) {
        this.scene.addLayer(layer)
        this.scene.addPopup(bindPopup(layer))
      }
      this.layers.set(rid, layer)
    }
    return this.layers.get(rid)!
  }
  /**从台账创建图层 */
  async createLayer(books: acRecord[]): Promise<PointLayer> {
    const db = connectDB()
    const data = books.map(async (book) => {
      if (book.wpid == null) throw new Error('')
      const wp = await WorkParam.instance.selectById(book.wpid, db, false)
      return { book, wp }
    })
    return await Promise.allSettled(data)
      .then((res) => {
        return res
          .filter((r) => r.status == 'fulfilled')
          .map((el) => {
            if (el.status === 'rejected') throw new Error('')
            return el.value
          })
      })
      .then((res) => {
        const geojson = createGeojson(res)
        return createL7Layer(geojson)
      })
      .finally(() => {
        db.destroy()
      })
  }
}

/**匹配台账 */
async function matchBook(books: acRecord[]) {
  let successCount = 0,
    failCount = 0
  const db = connectDB()
  const list = Array<Promise<void>>()
  for (let i = 0; i < books.length; i++) {
    const book = books[i]
    if (book.wpid == null) {
      list.push(
        writeWpid(book, db, false)
          .then((id) => {
            book.wpid = id
            successCount++
          })
          .catch(() => {
            failCount++
          }),
      )
    } else {
      successCount++
    }
  }
  await Promise.allSettled(list).finally(() => {
    db.destroy()
    ElMessage({
      type: 'info',
      message: `台账-工参匹配数量${successCount};未匹配数量${failCount}`,
    })
  })
  return books
}
