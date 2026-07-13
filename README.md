# 西湖无碍行

面向残障人士的杭州西湖无障碍旅游 PWA 原型，提供语音与文字导览、无障碍设施查询和示范友好路线。

## 本地运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

不配置地图 Key 时会自动显示本地模拟地图。需要接入高德地图时，在 `.env.local` 中填写：

```text
VITE_AMAP_KEY=你的 Web 端 JS API Key
VITE_AMAP_SECURITY_CODE=你的安全密钥
```

不要提交 `.env` 或 `.env.local`。示例设施和路线并非实时数据，不能替代现场确认。

## 检查

```bash
npm run typecheck
npm test -- --run
npm run build
```
