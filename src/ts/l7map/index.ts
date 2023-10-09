import { gaodeKeySecurityJsCode, gaodeToken } from '@/config/key'
import { Scene } from '@antv/l7'
import { GaodeMap } from '@antv/l7-maps'
import icomoonWoffUrl from '../../assets/icomoon.woff?url'
// 直接全局密钥了
if (gaodeKeySecurityJsCode)
  window._AMapSecurityConfig = {
    securityJsCode: gaodeKeySecurityJsCode,
  }
function createMap(dom: HTMLDivElement) {
  // 高德配置参考手册,https://lbs.amap.com/api/javascript-api-v2/documentation#map
  const gaodeMap = new GaodeMap({
    style: 'amap://styles/whitesmoke', //https://lbs.amap.com/api/javascript-api-v2/guide/map/map-style
    center: [115.849336, 39.042734],
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
  private readyHandle!: (value: Scene | PromiseLike<Scene>) => void
  scene?: Scene
  gaodeMap?: GaodeMap
  constructor() {
    this.ready = new Promise<Scene>((res) => {
      this.readyHandle = res
    })
  }
  createMap(dom: HTMLDivElement) {
    const { scene, gaodeMap } = createMap(dom)
    this.scene = scene
    this.initFontFamily(scene)
    this.gaodeMap = gaodeMap
    this.readyHandle(scene)
  }
  private initFontFamily(scene: Scene) {
    scene.addIconFont('arrow80', '&#xe900;')
    scene.addIconFont('arrow120', '&#xe901;')
    scene.addIconFont('arrow160', '&#xe902;')
    scene.addIconFont('arrow200', '&#xe903;')
    scene.addFontFace('arrow-icon', icomoonWoffUrl)
  }
}
