<template>
  <ElRow>
    <ElButtonGroup size="small">
      <ElDropdown trigger="click">
        <ElButton plain>文件</ElButton>
        <template #dropdown>
          <ElDropdownMenu>
            <UploadAccountBook>
              <ElDropdownItem>上传台账</ElDropdownItem>
            </UploadAccountBook>
            <UploadWorkParam>
              <ElDropdownItem>上传工参</ElDropdownItem>
            </UploadWorkParam>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
      <ElDropdown trigger="click">
        <ElButton plain>窗口</ElButton>
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
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </ElButtonGroup>
  </ElRow>
</template>
<script setup lang="ts">
import { ipcRenderer } from 'electron'
import UploadAccountBook from '@/component/Toolbar/UploadAccountBook.vue'
import UploadWorkParam from '@/component/Toolbar/UploadWorkParam.vue'
</script>
