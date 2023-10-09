<template>
  <div>
    <h2>图层</h2>
    <ElScrollbar max-height="30vh"
      ><p v-for="(item, index) in records" :key="index">
        <el-checkbox
          v-model="item.checked"
          @change="(e) => checkLayer(item.rid,e as boolean)"
          :label="item.name"
        />
      </p>
    </ElScrollbar>
    <ElDivider></ElDivider>
  </div>
</template>
<script setup lang="ts">
import { BookRecords, bookRecords } from '@/render/store'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { LayerManager } from '.'
import { MapInstance } from '@/ts/l7map'

const manager = new LayerManager()
const props = defineProps<{
  map: MapInstance
}>()
const mapInstance = props.map
mapInstance.ready.then((scene) => {
  manager.linkScene(scene)
})
const checkedSet = new Set<number>()
const records = ref<(bookRecords & { checked: boolean })[]>([])
async function reflash() {
  records.value = (await BookRecords.instance.select()).map((el) =>
    reactive({
      ...el,
      checked: checkedSet.has(el.rid),
    }),
  )
}
onMounted(() => {
  reflash()
})
const rmSymbol = Symbol()
BookRecords.instance.observer.on('insert', reflash, rmSymbol)
onUnmounted(() => {
  BookRecords.instance.observer.offBySymbol(rmSymbol)
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
</script>
<style></style>
