<template>
  <LoadFiles @loadend="textload" accept=".xlsx">
    <slot></slot>
  </LoadFiles>
</template>
<script setup lang="ts">
import LoadFiles from '@/component/LoadFiles.vue'
import { execElsx } from '@/ts/xlsx'

function textload(payload: { result: ArrayBuffer; name: string }) {
  execElsx(payload.result, payload.name, 'accountBook')
}
</script>
