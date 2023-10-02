<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ipcRenderer } from 'electron'
import fs from 'fs'
import { MapInstance } from '@/ts/l7map'
import { baseStore } from '@/render/store'
import LoadFilesVue from './LoadFiles.vue'
import { execElsx } from '@/ts/xlsx'
const mapContainer = ref<HTMLDivElement>()
const mapInstance = new MapInstance()
onMounted(() => {
  console.log('fs:', fs)
  console.log('ipcRenderer:', ipcRenderer)
  if (!mapContainer.value) throw new Error('map容器初始化失败')
  mapInstance.createMap(mapContainer.value)
  mapInstance.ready.then(() => {})
})
const basestore = baseStore()
function textload(payload: { result: ArrayBuffer; name: string }) {
  execElsx(payload.result, payload.name, 'accountBook')
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
      <LoadFilesVue @loadend="textload" accept=".xlsx"></LoadFilesVue>
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
