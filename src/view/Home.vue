<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ipcRenderer } from 'electron'
import fs from 'fs'
import { createMap } from '@/ts/l7map'
import { baseStore } from '@/render/store'
const mapContainer = ref<HTMLDivElement>()
onMounted(() => {
  console.log(fs)
  console.log(ipcRenderer)
  if (!mapContainer.value) throw new Error('map容器初始化失败')
  createMap(mapContainer.value)
})
const basestore = baseStore()
</script>

<template>
  <ElContainer class="fill-container">
    <ElMain>
      <div ref="mapContainer" class="map-container"></div>
    </ElMain>
    <ElAside width="20%"
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
