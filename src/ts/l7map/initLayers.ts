import { LineLayer, Scene } from '@antv/l7'
import fs from 'fs'
import path from 'path'
import { wgs_gcj } from '@wuch96/coords-translate'
export async function initLayers(scene: Scene) {
  const polylineDir = path.join(process.cwd(), './data/xiamen1.geojson')
  const layer = new LineLayer()
  const data = await new Promise<Buffer>((res, rej) => {
    fs.readFile(polylineDir, (err, data) => {
      if (err) rej(err)
      else res(data)
    })
  })
  const source = JSON.parse(
    data.toString(),
  ) as GeoJSON.FeatureCollection<GeoJSON.MultiLineString>
  source.features.forEach((el) => {
    el.geometry.coordinates.forEach((positions) => {
      positions.forEach((position) => {
        const t = wgs_gcj({ lng: position[0], lat: position[1] })
        position[0] = t.lng
        position[1] = t.lat
      })
    })
  })
  layer.source(source).shape('line').color('blue').active({
    color: 'red',
    mix: 0.6,
  })
  layer.on('click', (e) => {
    console.log(e)
    const f = e.feature as GeoJSON.Feature<
      GeoJSON.MultiLineString,
      { objectid: number }
    >
    
    const d = JSON.parse(data.toString())
    console.time('test')
    layer.source(d)
    layer.render()
    console.timeEnd('test')
  })
  layer.on('legend:color', (ev) => console.log(ev))
  function changeColor() {
    console.time('interval')
    layer.once('legend:color', () => {
      console.timeEnd('interval')
      setTimeout(() => {
        changeColor()
      }, 3000)
    })
    layer.color(
      '',
      () =>
        `rgb(${(Math.random() * 255).toFixed(0)},${(
          Math.random() * 255
        ).toFixed(0)},${(Math.random() * 255).toFixed(0)})`,
    )
    layer.render()
  }
  scene.addLayer(layer)
  layer.once('add', () => {
    // Promise.resolve().then(() => changeColor())
  })
}
