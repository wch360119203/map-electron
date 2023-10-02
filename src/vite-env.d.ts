/// <reference types="vite/client" />
/// <reference types="element-plus/global.d.ts" />
declare interface Window {
  _AMapSecurityConfig: {
    securityJsCode: string
  }
}

declare type OmitKey<T, K> = keyof Omit<T, keyof K>
