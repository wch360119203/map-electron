import { gaodeKeySecurityJsCode, gaodeToken } from '@/config/key'
import { Scene } from '@antv/l7'
import { GaodeMap } from '@antv/l7-maps'
// 直接全局密钥了
if (gaodeKeySecurityJsCode)
  window._AMapSecurityConfig = {
    securityJsCode: gaodeKeySecurityJsCode,
  }
function createMap(dom: HTMLDivElement) {
  // 高德配置参考手册,https://lbs.amap.com/api/javascript-api-v2/documentation#map
  const gaodeMap = new GaodeMap({
    style: 'amap://styles/dark', //https://lbs.amap.com/api/javascript-api-v2/guide/map/map-style
    center: [118.08, 24.48],
    zoom: 12,
    pitch: 0,
    token: gaodeToken,
    // pitchEnable: false,
    // rotateEnable: false,
    isHotspot: false,
    terrain: true,
    viewMode: '2D',
  })
  const scene = new Scene({
    id: dom,
    map: gaodeMap,
    logoVisible: false,
  })
  return { scene, gaodeMap }
}
export class MapInstance {
  readonly ready
  private readyHandle!: (value: void | PromiseLike<void>) => void
  scene?: Scene
  gaodeMap?: GaodeMap
  constructor() {
    this.ready = new Promise<void>((res) => {
      this.readyHandle = res
    })
  }
  createMap(dom: HTMLDivElement) {
    const { scene, gaodeMap } = createMap(dom)
    this.scene = scene
    this.gaodeMap = gaodeMap
    this.readyHandle()
  }
}
