<template>
  <span
    style="
       {
        user-select: all;
        -webkit-app-region: none;
        margin-left: 10px;
      }
    "
  >
    <ElButtonGroup size="small">
      <ElDropdown trigger="click" placement="bottom-start">
        <ElButton text plain>文件</ElButton>
        <template #dropdown>
          <ElDropdownMenu>
            <UploadAccountBook>
              <ElDropdownItem>上传台账</ElDropdownItem>
            </UploadAccountBook>
            <UploadWorkParam>
              <ElDropdownItem>上传工参</ElDropdownItem>
            </UploadWorkParam>
            <ElDropdownItem @click="router.push({ name: 'file' })"
              >文件管理</ElDropdownItem
            >
          </ElDropdownMenu>
        </template>
      </ElDropdown>
      <ElDropdown trigger="click" placement="bottom-start">
        <ElButton text plain>窗口</ElButton>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem @click="ipcRenderer.invoke('reload')"
              >刷新(Ctrl+R)</ElDropdownItem
            >
            <ElDropdownItem @click="ipcRenderer.invoke('fullScreen')"
              >全屏(F11)</ElDropdownItem
            >
            <ElDropdownItem @click="ipcRenderer.invoke('toggleDevTools')"
              >控制台(Ctrl+Shift+I)</ElDropdownItem
            >
            <ElDivider></ElDivider>
            <ElDropdownItem @click="router.push({ name: 'file' })"
              >文件管理</ElDropdownItem
            >
            <ElDropdownItem @click="router.push({ name: 'home' })"
              >地图页</ElDropdownItem
            >
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </ElButtonGroup>
  </span>
</template>
<script setup lang="ts">
import { ipcRenderer } from 'electron'
import UploadAccountBook from '@/component/Toolbar/UploadAccountBook.vue'
import UploadWorkParam from '@/component/Toolbar/UploadWorkParam.vue'
import { router } from '@/render'
</script>
