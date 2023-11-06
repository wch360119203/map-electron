import { Underlay } from '@/render/store/sqlite/Underlay'
import { PolygonLayer, Scene } from '@antv/l7'
import { coordEach } from '@turf/turf'
import { wgs_gcj } from '@wuch96/coords-translate'

export async function addUnderlay(scene: Scene) {
  const list = await Underlay.instance.select()
  list.forEach((row) => {
    const geojson = JSON.parse(row.geojson)
    coordEach(geojson, (coords) => {
      const lnglat = wgs_gcj({ lng: coords[0], lat: coords[1] })
      coords[0] = lnglat.lng
      coords[1] = lnglat.lat
    })
    const layer = new PolygonLayer()
    layer
      .source(geojson)
      .shape('line')
      .color(row.color ?? 'red')
    scene.addLayer(layer)
  })
}
