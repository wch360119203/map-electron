import { acRecord, workParam } from '@/render/store'
import { point, featureCollection } from '@turf/helpers'
import { wgs_gcj } from '@wuch96/coords-translate'
import { ILayer, LayerPopup, PointLayer } from '@antv/l7'
import PopupVue from './Popup.vue'
import { createApp } from 'vue'
import { featureEach } from '@turf/meta'
import { cloneDeep } from 'lodash-es'
export function createGeojson(
  data: {
    book: acRecord | null
    wp: workParam
  }[],
) {
  const points = data.map((el) => {
    const lnglat = wgs_gcj({ lat: el.wp.lat, lng: el.wp.lng })
    return point([lnglat.lng, lnglat.lat], {
      ...el,
      name: el.wp.community_name,
      icon: calculateIcon(el.wp),
    })
  })
  const collection = featureCollection(points)
  return collection
}
/**创建基本图层 */
export function createL7Layer(json: ReturnType<typeof createGeojson>) {
  const copy = cloneDeep(json)
  featureEach(copy, (el) => {
    el.properties.icon
  })
  const layer = new PointLayer({ visible: false })
  layer
    .source(json)
    .shape('icon', 'text')
    .color('green')
    .color('book', (book: acRecord) => {
      if (book?.['7d_avg_availability'] == undefined) return 'skyblue'
      const rate = book['7d_avg_availability']
      if (rate < 0.7) return '#fa7e23'
      if (rate <= 0.8) return '#FF7373'
      if (rate <= 0.9) return 'red'
      return '#A60000'
    })
    .size(38)
    .style({
      //https://l7.antv.antgroup.com/common/district/label#label-标注配置项
      //https://l7.antv.antgroup.com/api/point_layer/style#text
      fontFamily: 'arrow-icon',
      iconfont: true,
      textAllowOverlap: true, //允许文本覆盖
      textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
      textOffset: [-11, 0], // 文本相对锚点的偏移量 [水平, 垂直]
      rotation: {
        field: 'wp',
        value: (wp: workParam) => {
          return -1 * wp.rotate
        },
      },
    })
  return layer
}
/**创建文字注记 */
export function createL7TextLayer(json: ReturnType<typeof createGeojson>) {
  const layer = new PointLayer({
    visible: false,
    enablePropagation: true,
    zIndex: 450,
    enablePicking: false,
  })
  layer
    .source(json)
    .shape('name', 'text')
    .color('black')
    .size(12)
    .style({
      textAnchor: 'bottom', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
      textOffset: [0, -30], // 文本相对锚点的偏移量 [水平, 垂直]
      spacing: 2, // 字符间距
      padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
      stroke: '#ffffff', // 描边颜色
      strokeWidth: 1, // 描边宽度
      strokeOpacity: 1.0,
    })
  return layer
}
export function bindPopup(layer: ILayer) {
  let unMount: () => void
  const popup = new LayerPopup({
    items: [
      {
        layer,
        customContent: (feature) => {
          const div = document.createElement('div')
          const app = createApp(PopupVue, { data: feature })
          app.mount(div)
          unMount = () => app.unmount()
          return div
        },
      },
    ],
    trigger: 'click',
  })
  popup.on('hide', () => {
    unMount?.()
  })
  popup.on('close', () => {
    unMount?.()
  })
  return popup
}

/**从入表日期中计算出该使用的icon */
function calculateIcon(workparam: workParam) {
  const siteType = workparam.site_type,
    deviceType = workparam.device_type
  if (/室分/.test(siteType)) return '■'
  if (/[2100|2.1G]/.test(deviceType)) return 'arrow120'
  if (/[1800|1.8G]/.test(deviceType)) return 'arrow160'
  else return 'arrow200'
}
