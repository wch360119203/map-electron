<template>
  <span v-show="!isDrawing" @click="startDraw">
    <slot></slot>
  </span>
  <span v-show="isDrawing">
    <ElButton circle :icon="Check" type="primary" @click="submit"></ElButton>
    <ElButton circle :icon="Close" type="danger" @click="close"></ElButton>
  </span>
  <ElDialog v-model="isNameInputShow" title="输入地名" destroy-on-close center @closed="() => rejectInput()" width="350px">
    <div class="center-box">
      <ElInput v-model="poiName"></ElInput>
      <ElButton @click="() => submitPoiName()" type="primary" :disabled="poiName.length == 0">确定</ElButton>
    </div>
  </ElDialog>
</template>
<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import { Check, Close } from '@element-plus/icons-vue'
import { MapInstance } from '@/ts/l7map';
import { DrawPolygon } from '@antv/l7-draw';
import { Poi } from '@/render/store';
import { coordEach } from '@turf/turf';
import { gcj_wgs } from '@wuch96/coords-translate';
const props = defineProps<{ map: MapInstance }>()
const map = props.map
const isDrawing = ref(false)
const isNameInputShow = ref(false)
const poiName = ref('')
let drawer: DrawPolygon | null
function startDraw() {
  isDrawing.value = true
  map.ready.then(scene => {
    drawer = new DrawPolygon(scene, { autoActive: true, maxCount: 1, helper: { pointHover: '左键可拖拽调整节点位置，右键删除节点' } })
    drawer.enable()
  })
}
function stopDraw() {
  isDrawing.value = false
  drawer?.disable()
  drawer?.destroy()
  drawer = null
}
function submit() {
  const data = drawer?.getData()
  if (data?.length !== 1) {
    stopDraw()
    return
  }
  getPoiName().then((name) => {
    const geojson = data[0]
    coordEach(geojson, (coords,coordIndex) => {
      if(coordIndex==0)return
      const gcj = gcj_wgs({ lng: coords[0], lat: coords[1] })
      coords[0] = gcj.lng
      coords[1] = gcj.lat
    })
    return Poi.instance.insert([{ name, geojson: JSON.stringify(geojson) }])
  }).finally(() => {
    stopDraw()
  })
}
function close() {
  stopDraw()
}
onUnmounted(() => {
  stopDraw()
})
let submitPoiName = () => { }
let rejectInput = () => { }
function getPoiName() {
  isNameInputShow.value = true
  return new Promise<string>((res, rej) => {
    submitPoiName = () => {
      isNameInputShow.value = false
      res(poiName.value)
    }
    rejectInput = () => {
      rej()
    }
  })
}
</script>