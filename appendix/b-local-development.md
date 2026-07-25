# 附录 B：本地开发

本章面向需要修改源码、调试 API 或提交代码的开发者。仅通过 GitHub 和 Vercel 部署时可以跳过。

## 环境要求

推荐安装：

- Git；
- Node.js 20 LTS；
- npm；
- VS Code 或其他编辑器；
- 可选：Vercel CLI；
- 构建 ClassIsland 插件时另需 .NET 8 SDK。

检查版本：

```bash
node --version
npm --version
git --version
```

## 获取源码

```bash
git clone https://github.com/你的用户名/Novora.git
cd Novora
npm install
```

不要把 `node_modules` 提交到 GitHub。

## 仅运行前端

```bash
npm run dev
```

Vite 默认运行在：

```text
http://localhost:5173
```

项目的 Vite 配置会把 `/api` 代理到 `http://localhost:3000`。如果 3000 端口没有本地 API 服务，页面能打开，但登录、同步和数据库功能会失败。

## 使用 Vercel CLI 调试 API

安装并登录 Vercel CLI：

```bash
npm install --global vercel
vercel login
vercel link
```

把项目的开发环境变量拉取到本地：

```bash
vercel env pull .env.local
```

`.env.local` 包含敏感信息，必须保持在 `.gitignore` 中。

运行完整 Vercel 本地环境：

```bash
vercel dev --listen 3000
```

可直接访问 Vercel dev 的 3000 端口；也可以同时运行 `npm run dev`，让 5173 端口把 `/api` 代理到 3000。

## 最小本地环境变量

```dotenv
DATABASE_URL=postgresql://...
ADMIN_PASSWORD=请使用开发环境专用密码
```

开发环境应使用独立 Neon 项目或分支。不要让本地调试直接连接生产数据库。

## 构建检查

提交前运行：

```bash
npm run build
npm run typecheck:api
```

`npm run build` 检查前端生产构建；`npm run typecheck:api` 按生产 Node ESM 方式编译并导入 API 入口。

构建结果位于 `dist`，通常不需要手工提交。

## 预览生产构建

```bash
npm run preview
```

此命令只预览静态构建结果，不会自动提供完整 Vercel Functions。涉及登录和数据写入时仍应使用 Vercel dev 或 Preview Deployment。

## 分支和预览环境

推荐流程：

1. 从最新生产分支创建功能分支；
2. 使用独立开发数据库；
3. 本地执行构建和 API 类型检查；
4. 推送分支，使用 Vercel Preview 验收；
5. 确认 Preview 没有连接生产数据库；
6. 合并后再执行生产验收。

## 兼容性注意事项

修改品牌或代码时，不要随意重命名：

- `exam-board-*` localStorage 键；
- `exam-board-offline` IndexedDB；
- `exam-board:*` 浏览器事件；
- `exam-board-shell-*` Service Worker 缓存；
- 现有数据库表和列；
- ClassIsland 插件 ID、程序集和 API 版本逻辑。

这些标识关系到升级后的本地缓存、设备绑定和插件兼容。

## 静态资源 CDN

Vite 支持通过 `ASSET_CDN_BASE` 设置构建资源前缀。只有已经将构建产物同步到对应 CDN、验证跨域和缓存策略后才启用。

`fonts.css` 使用 `/fonts/...` 绝对路径，不能仅靠 `ASSET_CDN_BASE` 自动迁移字体。配置错误会造成生产白屏或字体丢失。
