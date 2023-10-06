import { acRecord, workParam } from '@/render/store'
import { point, featureCollection } from '@turf/helpers'
import { wgs_gcj } from '@wuch96/coords-translate'
import { PointLayer } from '@antv/l7'
export function createGeojson(
  data: {
    book: acRecord
    wp: workParam
  }[],
) {
  const points = data.map((el) => {
    const lnglat = wgs_gcj({ lat: el.wp.lat, lng: el.wp.lng })
    return point([lnglat.lng, lnglat.lat], el)
  })
  const collection = featureCollection(points)
  return collection
}
export function createL7Layer(json: ReturnType<typeof createGeojson>) {
  const layer = new PointLayer({ visible: false, layerType: 'fillImage' })
  layer
    .source(json)
    .shape('sArrow')
    .color('red')
    .size(12)
    .style({
      rotation: {
        field: 'wp',
        value: (wp: workParam) => {
          return -1 * wp.rotate
        },
      },
    })
  return layer
}
