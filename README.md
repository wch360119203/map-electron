# map-electron

electron 封装的地图

## 安装步骤

请在 src/config 文件夹内创建 key.ts
写入如下代码

```typescript
// https://console.amap.com/dev/key/app
export const gaodeKeySecurityJsCode = '你的密钥' //密钥
export const gaodeToken = '你的key' //token
```

按顺序执行

```bash
pnpm install
pnpm run postinstall
pnpm run rebuild
pnpm run dev
```

- 注意 当你的工程下出现了这个文件 node_modules\better-sqlite3\build\Release\better_sqlite3.node，才证明 better_sqlite3 模块编译成功了，如果上述指令没有帮你完成这项工作，你可以把指令配置到 node_modules\better-sqlite3 模块内部再执行一次 pnpm run rebuild
