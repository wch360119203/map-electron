/// <reference types="vite/client" />
/// <reference types="element-plus/global.d.ts" />
declare interface Window {
  _AMapSecurityConfig: {
    securityJsCode: string
  }
}

declare type OmitKey<T, K> = keyof Omit<T, keyof K>
declare type intersectKey<T, K> = keyof Pick<T, keyof K>
declare type PickFromArr<T> = T extends Array<infer R> ? R : never
declare type PickMapValue<T> = T extends Map<any, infer R> ? R : never
