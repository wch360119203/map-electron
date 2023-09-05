import { LineLayer, Scene } from '@antv/l7'
import fs from 'fs'
import path from 'path'
export async function initLayers(scene: Scene) {
  const polylineDir = path.join(process.cwd(), './data/river.geojson')
  const layer = new LineLayer()
  const data = await new Promise<Buffer>((res, rej) => {
    fs.readFile(polylineDir, (err, data) => {
      if (err) rej(err)
      else res(data)
    })
  })
  layer
    .source(JSON.parse(data.toString()))
    .shape('line')
    .color('JB', (v) => {
      if (v < 4) return 'red'
      return 'skyblue'
    })
    .active({
      color: 'red',
      mix: 0.6,
    })
  layer.on('click', (e) => {
    console.log(e)
  })
  scene.addLayer(layer)
}
