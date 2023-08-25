# map-electron

electron 封装的地图

## 安装步骤

请在 src/config 文件夹内创建 key.ts
写入如下代码

```typescript
export const gaodeKeySecurityJsCode = undefined //密钥
export const gaodeToken = undefined //token
```

按顺序执行

```bash
pnpm install
pnpm run postinstall
pnpm run rebuild
pnpm run dev
```
