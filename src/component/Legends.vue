<template>
  <div class="map-legends radius-box">
    <ElText size="small" class="legend">利用率</ElText>
    <div class="legend" v-for="(item, index) in colorLegends" :key="index">
      <ElRow justify="center">
        <div class="circle" :style="{ background: item[0] }"></div>
      </ElRow>
      <ElRow justify="center">
        <ElText size="small">{{ item[1] }}</ElText>
      </ElRow>
    </div>
    <ElText size="small" class="legend">设备类型</ElText>
    <div class="legend" v-for="(item, index) in shapeLegends" :key="index">
      <ElRow justify="center">
        <img :src="item[0]" :style="{ width: '20px', height: '20px' }" />
      </ElRow>
      <ElRow justify="center">
        <ElText size="small">{{ item[1] }}</ElText>
      </ElRow>
    </div>
  </div>
</template>
<script setup lang="ts">
import sqrUrl from '@/assets/icons/sqr.svg'
import arrow120Url from '@/assets/icons/arrow120.svg'
import arrow160Url from '@/assets/icons/arrow160.svg'
import arrow200Url from '@/assets/icons/arrow200.svg'
const shapeLegends = [
  [sqrUrl, '室分'],
  [arrow120Url, '2.1G'],
  [arrow160Url, '1.8G'],
  [arrow200Url, '800/900'],
]
const colorLegends = [
  ['#fa7e23', '<70%'],
  ['#FF7373', '≤80%'],
  ['red', '≤90%'],
  ['#A60000', '超过90%'],
]
</script>
<style>
.map-legends {
  position: absolute;
  left: 40px;
  bottom: 40px;
  background-color: #f2f2f2;
  display: grid;
  grid-template-columns: auto repeat(4, 1fr);
  gap: 15px;
  z-index: 999;

  .circle {
    border-radius: 50%;
    width: 12px;
    height: 12px;
  }
}
</style>