<template>
  <div class="topbar">
    <img :src="iconUrl" :style="{ height: '20px', margin: '0px 5px' }" />
    {{ title }}
    <div class="topbar-window-operate">
      <component
        :is="createSvgCom(minimize)"
        @click="minimizeMainWin"
      ></component>
      <component
        v-if="isWindowMax"
        :is="createSvgCom(unmaximize)"
        @click="unmaximizeWindow"
      ></component>
      <component
        v-else
        :is="createSvgCom(maximize)"
        @click="maxmizeMainWin"
      ></component>
      <component :is="createSvgCom(closeSvg)" @click="closeWindow"></component>
    </div>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { ipcRenderer } from 'electron'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import closeSvg from '@/assets/icons/close.svg?raw'
import minimize from '@/assets/icons/minimize.svg?raw'
import unmaximize from '@/assets/icons/unmaximize.svg?raw'
import maximize from '@/assets/icons/maximize.svg?raw'
import { createSvgCom } from '@/ts/utils'
import iconUrl from '@/assets/icons/map-icon.png'
const props = defineProps<{
  title: string
}>()
const title = computed(() => props.title)
/**窗口是否最大化 */
const isWindowMax = ref(true)
/**关闭 */
function closeWindow() {
  ipcRenderer.invoke('closeWindow')
}
/**最大化 */
function maxmizeMainWin() {
  ipcRenderer.invoke('maxmizeWindow')
}
/**最小化 */
function minimizeMainWin() {
  ipcRenderer.invoke('minimizeWindow')
}
/**取消最大化 */
function unmaximizeWindow() {
  ipcRenderer.invoke('unmaximizeWindow')
}
function windowMaximizedEvent() {
  isWindowMax.value = true
}
function windowUnmaximizedEvent() {
  isWindowMax.value = false
}
onMounted(() => {
  ipcRenderer.on('windowMaximized', windowMaximizedEvent)
  ipcRenderer.on('windowUnmaximized', windowUnmaximizedEvent)
})
onUnmounted(() => {
  ipcRenderer.off('windowMaximized', windowMaximizedEvent)
  ipcRenderer.off('windowUnmaximized', windowUnmaximizedEvent)
})
</script>
<style lang="scss">
.topbar {
  height: 100%;
  width: 100%;
  display: flex;
  position: relative;
  align-items: center;
  background-color: #ecf5ff;
  font-size: 14px;
  -webkit-app-region: drag;
  user-select: none;
  .topbar-window-operate {
    -webkit-app-region: no-drag;
    display: flex;
    position: absolute;
    right: 5px;
    height: 100%;
    div {
      padding: 0px 15px;
      display: flex;
      align-items: center;
      &:hover {
        background-color: #d9ecff;
      }
      & svg {
        height: 16px;
      }
    }
  }
}
</style>
