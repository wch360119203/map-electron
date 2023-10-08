import { AccountBook, WorkParam, acRecord, writeWpid } from '@/render/store'
import { connectDB } from '@/render/store/DB'
import { BaseLayer, PointLayer, Scene } from '@antv/l7'
import { Observer } from '@wuch96/utils'
import {
  bindPopup,
  createGeojson,
  createL7Layer,
  createL7TextLayer,
} from './createGeojson'
import { ElMessage } from 'element-plus'
export class LayerManager {
  static instance = new LayerManager()
  observer = new Observer<{
    layerChange(acRid: number, isOpened: boolean): void
  }>()
  layers = new Map<number, BaseLayer[]>()
  scene?: Scene
  private constructor() {
    this.observer.on('layerChange', async (acrid, isopen) => {
      const layer = await this.getLayer(acrid)
      if (isopen) {
        layer.forEach(showLayer)
        layer[0]?.fitBounds()
      } else {
        layer.forEach(hideLayer)
      }
    })
  }
  /**关联scene */
  linkScene(scene: Scene) {
    this.scene = scene
    this.layers.forEach((layerArr) => {
      layerArr.forEach((layer) => {
        scene.addLayer(layer)
        scene.addPopup(bindPopup(layer))
      })
    })
  }
  /**获取图层 */
  async getLayer(rid: number): Promise<BaseLayer[]> {
    if (!this.layers.has(rid)) {
      const books = await AccountBook.instance.selectByRid(rid)
      const validBooks = (await matchBook(books)).filter(
        (el) => el.wpid != null,
      )
      const ls = await this.createLayers(validBooks)
      if (this.scene) {
        ls.forEach((l) => this.scene!.addLayer(l))
        this.scene.addPopup(bindPopup(ls[0]))
      }
      this.layers.set(rid, ls)
    }
    return this.layers.get(rid)!
  }
  /**从台账创建图层 */
  async createLayers(books: acRecord[]): Promise<PointLayer[]> {
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
        return [createL7Layer(geojson), createL7TextLayer(geojson)]
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

function showLayer(layer: BaseLayer) {
  layer.show()
}
function hideLayer(layer: BaseLayer) {
  layer.hide()
}
