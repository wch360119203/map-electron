<template>
  <div :style="{ paddingRight: '15px' }">
    <h2>图层</h2>
    <ElRow>
      <ElText size="small">时间筛选：</ElText>
      <ElRadioGroup @change="setFilter" v-model="recentlyFilter">
        <ElRadio :label="7">最近7天</ElRadio>
        <ElRadio :label="14">最近14天</ElRadio>
        <ElRadio :label="30">最近30天</ElRadio>
        <ElRadio :label="-1">自定义</ElRadio>
      </ElRadioGroup>
      <span v-show="recentlyFilter === -1">
        <ElText size="default">筛选最近 </ElText>
        <ElInputNumber @change="setFilter" size="small" v-model="diyRecentlyFilter"></ElInputNumber>
        <ElText size="default"> 天</ElText>
      </span>
    </ElRow>
    <ElRow>
      <ElText size="small">运营商：</ElText>
      <ElRadioGroup v-model="operatorFilter" @change="setFilter">
        <ElRadio label="全部"></ElRadio>
        <ElRadio label="电信"></ElRadio>
        <ElRadio label="联通"></ElRadio>
      </ElRadioGroup>
    </ElRow>
    <ElScrollbar max-height="30vh" v-loading=isloading>
      <p v-for="( item, index ) in  records " :key="index">
      <div class="check-card">
        <el-checkbox v-model="item.checked" @change="(e) => checkLayer(item.rid, e as boolean)" :label="item.name" />
      </div>
      </p>
    </ElScrollbar>
    <ElDivider></ElDivider>
  </div>
</template>
<script setup lang="ts">
import { BookRecords, WorkParam, bookRecords } from '@/render/store'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { LayerManager } from '.'
import { MapInstance } from '@/ts/l7map'
import { throttle } from 'lodash-es'
const isloading = ref(true)
const operatorFilter = ref('全部')
const manager = new LayerManager()
const props = defineProps<{
  map: MapInstance
}>()
const mapInstance = props.map
mapInstance.ready.then((scene) => {
  manager.linkScene(scene)
  manager.createWpLayer()
})
WorkParam.instance.observer.on('inserted', () => {
  manager.updateWpLayer()
})
const checkedSet = new Set<number>()
const records = ref<(bookRecords & { checked: boolean })[]>([])
async function reflash(recentlyDay: number) {
  isloading.value = true
  const newRecords = (await BookRecords.instance.select(recentlyDay, operatorFilter.value)).map((el) =>
    reactive({
      ...el,
      checked: checkedSet.has(el.rid),
    }),
  )
  const set = new Set<number>(records.value.map(el => el.rid))
  newRecords.forEach(el => { set.delete(el.rid) })
  set.forEach(rid => {
    checkLayer(rid, false)
  })
  records.value = newRecords
  isloading.value = false
}
onMounted(() => {
  setFilter()
})
const rmSymbol = Symbol()
BookRecords.instance.observer.on('insert', setFilter, rmSymbol)
manager.observer.on('layerChange', () => {
  mapInstance.scene?.render()
}, rmSymbol)
onUnmounted(() => {
  BookRecords.instance.observer.offBySymbol(rmSymbol)
  manager.observer.offBySymbol(rmSymbol)
})
/**图层选中 */
async function checkLayer(rid: number, isChecked: boolean) {
  if (!isChecked) {
    checkedSet.delete(rid)
    manager.hideLayer(rid)
    return
  }
  checkedSet.add(rid)
  manager.showLayer(rid)
}

const recentlyFilter = ref(7)
const diyRecentlyFilter = ref(30)
const throttleReflash = throttle(reflash, 500, { leading: false })
function setFilter() {
  if (recentlyFilter.value === -1) {
    throttleReflash(diyRecentlyFilter.value)
  } else {
    reflash(recentlyFilter.value)
  }
}
</script>
