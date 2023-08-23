import { gaodeKeySecurityJsCode, gaodeToken } from '@/config/key'
import { Scene } from '@antv/l7'
import { GaodeMap } from '@antv/l7-maps'
// 直接全局密钥了
window._AMapSecurityConfig = {
  securityJsCode: gaodeKeySecurityJsCode,
}
export function createMap(dom: HTMLDivElement) {
  const gaodeMap = new GaodeMap({
    style: 'amap://styles/whitesmoke', //https://lbs.amap.com/api/javascript-api-v2/guide/map/map-style
    center: [119.270672, 26.059869],
    zoom: 12,
    pitch: 0,
    token: gaodeToken,
  })
  const scene = new Scene({
    id: dom,
    map: gaodeMap,
    logoVisible: false,
  })
  return { scene, gaodeMap }
}
