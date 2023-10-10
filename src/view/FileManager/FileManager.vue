<template>
  <div class="full-screen padding8">
    <div>
      <el-button :icon="Back" circle @click="router.push({ name: 'home' })" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { Back } from '@element-plus/icons-vue'
import { router } from '@/render'
</script>
