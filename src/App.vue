<template>
  <el-config-provider :locale="zhCn">
    <ElContainer class="app-main">
      <el-header height="30px" class="no-padding">
        <TopBar title="基础地图">
          <ToolBarVue></ToolBarVue>
        </TopBar>
      </el-header>
      <el-main class="no-padding fill-container app-content">
        <router-view />
      </el-main>
    </ElContainer>
  </el-config-provider>
</template>
<script setup lang="ts">
import ToolBarVue from '@/view/ToolBar.vue'
import TopBar from './render/TopBar.vue'
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>
<style>
.app-main {
  width: 100vw;
  height: 100vh;
}

.app-content {
  background-image: url('@/assets/texture.png');
}</style>
