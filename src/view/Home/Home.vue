<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ipcRenderer } from 'electron'
import fs from 'fs'
import { MapInstance } from '@/ts/l7map'
import { baseStore } from '@/render/store'
import { initLayers } from '@/ts/l7map/initLayers'
import LoadGeojson from './LoadGeojson.vue'
const mapContainer = ref<HTMLDivElement>()
const mapInstance = new MapInstance()
onMounted(() => {
  console.log('fs:', fs)
  console.log('ipcRenderer:', ipcRenderer)
  if (!mapContainer.value) throw new Error('map容器初始化失败')
  mapInstance.createMap(mapContainer.value)
  mapInstance.ready.then(() => {
    // initLayers(mapInstance.scene!)
  })
})
const basestore = baseStore()
function textload(payload: { text: string }) {
  const json = JSON.parse(payload.text)
  console.log(json)
}
</script>

<template>
  <ElContainer class="fill-container">
    <ElMain>
      <div ref="mapContainer" class="map-container"></div>
    </ElMain>
    <ElAside width="20%"
      >aside
      <div @click="basestore.addCount">{{ basestore.count }}</div>
      <LoadGeojson @loadend="textload"></LoadGeojson>
    </ElAside>
  </ElContainer>
</template>

<style lang="scss">
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
../../ts/l7map/initLayers
