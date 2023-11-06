import {
  AccountBook,
  WorkParam,
  acRecord,
  writeWpid,
} from '@/render/store'
import { connectDB } from '@/render/store/DB'
import { BaseLayer, LayerPopup, PointLayer, Scene } from '@antv/l7'
import { Observer } from '@wuch96/utils'
import {
  bindPopup,
  createGeojson,
  createL7Layer,
  createL7TextLayer,
} from './createGeojson'
import { ElMessage } from 'element-plus'
export class LayerManager {
  observer = new Observer<{
    layerChange(acRid: number, isOpened: boolean): void
    sceneLinked(): void
  }>()
  layers = new Map<number, BaseLayer[]>()
  wpLayers?: {
    layer: PointLayer
    text: PointLayer
    popup: LayerPopup
  }
  scene?: Scene
  private popups = new Map<BaseLayer, LayerPopup>()
  constructor() {
    this.createWpLayer().then((r) => {
      this.wpLayers = r
      if (this.scene) {
        this.scene.addLayer(this.wpLayers.layer)
        this.scene.addLayer(this.wpLayers.text)
        this.scene.addPopup(this.wpLayers.popup)
      }
    })
  }
  /**显示图层，懒加载 */
  async showLayer(rid: number) {
    const layers = await this.getLayers(rid)
    layers.forEach((layer) => {
      layer.show()
    })
    layers[0]?.fitBounds()
    this.observer.dispatch('layerChange', rid, true)
  }
  /**隐藏图层，也会触发加载 */
  async hideLayer(rid: number) {
    if (!this.layers.has(rid)) return
    const layers = await this.getLayers(rid)
    layers.forEach((layer) => {
      layer.hide()
      const popup = this.popups.get(layer)
      popup?.hide()
    })
    this.observer.dispatch('layerChange', rid, false)
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
    if (this.wpLayers) {
      scene.addLayer(this.wpLayers.layer)
      scene.addLayer(this.wpLayers.text)
      scene.addPopup(this.wpLayers.popup)
    }
    this.observer.dispatch('sceneLinked')
  }
  /**根据时间筛选图层 */
  async filterLayers(rid: number, recentlyDay?: number) {
    const layers = this.getLayers(rid)
    const oneday = 24 * 60 * 60 * 1000
    const since = new Date().valueOf() - oneday * (recentlyDay ?? 1)
    ;(await layers).forEach((layer) => {
      layer.filter('book', (book: acRecord | null) => {
        if (recentlyDay == undefined) return true
        const date = book?.['65_overload_date']
        if (!date) return false
        return date >= since.valueOf()
      })
    })
    this.scene?.render()
  }
  /**从台账记录中获取图层 */
  private async getLayers(rid: number): Promise<BaseLayer[]> {
    if (!this.layers.has(rid)) {
      const books = await AccountBook.instance.selectByRid(rid)
      const validBooks = (await matchBook(books)).filter(
        (el) => el.wpid != null,
      )
      const ls = await this.createLayers(validBooks)
      if (this.scene) {
        ls.forEach((l) => this.scene!.addLayer(l))
        const popup = bindPopup(ls[0])
        this.popups.set(ls[0], popup)
        this.scene.addPopup(popup)
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
  private async createWpLayer() {
    const data = await WorkParam.instance.selectAll()
    const geojson = createGeojson(
      data.map((el) => ({
        wp: el,
        book: null,
      })),
    )
    const layer1 = createL7Layer(geojson),
      layer2 = createL7TextLayer(geojson)
    layer1.show()
    layer2.show()
    const popup = bindPopup(layer1)
    return { layer: layer1, text: layer2, popup }
  }
  async updateWpLayer() {
    if (!this.wpLayers) return
    const data = await WorkParam.instance.selectAll()
    const geojson = createGeojson(
      data.map((el) => ({
        wp: el,
        book: null,
      })),
    )
    this.wpLayers.layer.setData(geojson)
    this.wpLayers.text.setData(geojson)
  }
}

/**匹配台账 */
async function matchBook(books: acRecord[]) {
  let successCount = 0,
    failCount = 0
  const db = connectDB()
  const list = Array<Promise<any>>()
  await db
    .transaction(async (trx) => {
      for (let i = 0; i < books.length; i++) {
        const book = books[i]
        if (book.wpid == null) {
          list.push(
            writeWpid(book, trx)
              .then((payload) => {
                book.wpid = payload.wpid
                successCount++
                return payload.p
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
        trx.commit()
      })
    })
    .finally(() => {
      db.destroy()
      ElMessage({
        type: 'info',
        message: `台账-工参匹配数量${successCount};未匹配数量${failCount}`,
      })
    })
  return books
}
