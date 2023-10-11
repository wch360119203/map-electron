<template>
  <ElContainer class="fill-container">
    <ElMain>
      <div ref="mapContainer" class="map-container"></div>
      <Legends></Legends>
    </ElMain>
    <ElAside width="max(20% ,250px)">
      <LayerManagerVue :map="mapInstance"></LayerManagerVue>
    </ElAside>
  </ElContainer>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { MapInstance } from '@/ts/l7map'
import LayerManagerVue from '@/component/LayerManage/LayerManager.vue'
import Legends from '@/component/Legends.vue';
const emits = defineEmits<{
  (e: 'mapcreated', map: MapInstance): void
}>()
const mapContainer = ref<HTMLDivElement>()
const mapInstance = new MapInstance()
onMounted(() => {
  if (!mapContainer.value) throw new Error('map容器初始化失败')
  mapInstance.createMap(mapContainer.value)
  mapInstance.ready.then(() => {
    emits('mapcreated', mapInstance)
  })
})
</script>
<style lang="scss">
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
../../ts/l7map/initLayers
