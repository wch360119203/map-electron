<template>
  <ElRow align="middle" style="gap: 18px;">
    <h1>重点场景</h1>
    <DrawPoi :map="mapInstance">
      <ElButton :icon="EditPen" circle type="primary"></ElButton>
    </DrawPoi>
  </ElRow>
  <div>
    <div class="radius-box hover-highlight" v-for="(item, index) in poiList" :key="index" @click="fitBounds(item.id)">
      {{ item.name }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { EditPen } from '@element-plus/icons-vue';
import { Poi, poi } from '@/render/store';
import { type MapInstance } from '@/ts/l7map';
import type { Feature, Polygon } from 'geojson';
import { onMounted, onUnmounted, ref } from 'vue';
import { coordEach } from '@turf/meta'
import { featureCollection } from '@turf/helpers'
import { wgs_gcj } from '@wuch96/coords-translate';
import { PointLayer, PolygonLayer } from '@antv/l7';
import bbox from '@turf/bbox'
import DrawPoi from './DrawPoi/DrawPoi.vue';
const props = defineProps<{
  map: MapInstance
}>()
const mapInstance = props.map
const poiList = ref<poi[]>([])
const featureMap = new Map<number, Feature<Polygon, {
  id: number;
  name: string;
  remark?: string | null;
  update_date: number;
}>>()
let removeLayerHandle: () => void
async function getAllPoi() {
  removeLayerHandle?.()
  const arr = await Poi.instance.select()
  poiList.value = arr
  const collection = getGeojson(arr)
  const polygonLayer = new PolygonLayer()
  polygonLayer.source(collection).shape('fill').color('skyblue').style({ opacity: 0.6, opacityLinear: { enable: true, dir: 'out' } })
  const textLayer = new PointLayer()
  textLayer.source(collection).color('black').shape('name', 'text').size(15)
    .style({
      textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
      textOffset: [0, 0], // 文本相对锚点的偏移量 [水平, 垂直]
      spacing: 2, // 字符间距
      padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
      stroke: '#ffffff', // 描边颜色
      strokeWidth: 0.3, // 描边宽度
      strokeOpacity: 1.0
    });
  mapInstance.ready.then(scene => {
    scene.addLayer(polygonLayer)
    scene.addLayer(textLayer)
  })
  removeLayerHandle = () => {
    mapInstance.scene?.removeLayer(polygonLayer)
    mapInstance.scene?.removeLayer(textLayer)
  }
}
onMounted(() => {
  getAllPoi()
  removeLayerHandle?.()
})
const rmSymbol = Symbol()
Poi.instance.observer.on('insert', getAllPoi, rmSymbol)
onUnmounted(() => {
  Poi.instance.observer.offBySymbol(rmSymbol)
})
function getGeojson(arr: poi[]) {
  featureMap.clear()
  return featureCollection(arr.map(el => {
    const { geojson, ...otherParams } = el
    const json = JSON.parse(el.geojson) as Feature<Polygon, typeof otherParams>
    json.properties = otherParams
    coordEach(json, (coords) => {
      const lnglat = wgs_gcj({ lng: coords[0], lat: coords[1] })
      coords[0] = lnglat.lng
      coords[1] = lnglat.lat
    })
    featureMap.set(el.id, json)
    return json
  }))
}
function fitBounds(id: number) {
  const feature = featureMap.get(id)
  if (!feature) return
  const bounds = bbox(feature)
  mapInstance.scene?.fitBounds([[bounds[0], bounds[1]], [bounds[2], bounds[3]]])
}
</script>