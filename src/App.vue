<template>
  <ElContainer class="app-main">
    <el-header height="30px" class="no-padding">
      <TopBar title="基础地图"></TopBar>
    </el-header>
    <el-main class="no-padding">
      <router-view />
    </el-main>
  </ElContainer>
</template>
<script setup lang="ts">
import TopBar from './render/TopBar.vue'
</script>
<style>
.app-main {
  width: 100vw;
  height: 100vh;
}
</style>
