<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ipcRenderer } from 'electron'
import fs from 'fs-extra'
import { MapInstance } from '@/ts/l7map'
import { baseStore } from '@/render/store'
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
</script>

<template>
  <ElContainer class="fill-container">
    <ElMain>
      <div ref="mapContainer" class="map-container"></div>
    </ElMain>
    <ElAside width="max(20% ,250px)"
      >aside
      <div @click="basestore.addCount">{{ basestore.count }}</div>
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
