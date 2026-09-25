# 项目快速入门（开发者）

这一页给要改代码或参与开发的人。只部署不开发可以跳过。

## 技术栈

| 层 | 技术 |
| --- | --- |
| 前端 | React + TypeScript + Vite |
| 服务端 | Vercel Functions（`api/*.ts`），本地由 `server/` 适配器托管 |
| 数据库 | PostgreSQL（Neon 或自建） |
| 插件 | .NET 8 + ClassIsland Plugin SDK |

## 环境准备

- Git
- Node.js 24（项目声明 `24.x`）
- npm
- 可选：Vercel CLI（调试云端部署）
- 可选：Docker（跑本地全套环境）
- 构建 ClassIsland 插件时另需 .NET 8 SDK

## 拉取与安装

```bash
git clone https://github.com/你的用户名/Novora.git
cd Novora
npm install
```

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 只跑前端，`http://localhost:5173`，`/api` 代理到 3000 |
| `npm run serve` | 构建并启动完整本地服务（前端 + 全部 API），`http://localhost:3000` |
| `npm run build` | 前端生产构建 |
| `npm run typecheck:api` | 按生产 Node ESM 方式编译并导入 API 入口 |
| `npm run test` | 运行单元测试 |
| `npm run lint` | ESLint 检查 |

只跑 `npm run dev` 时页面能打开，但登录、同步和数据库功能会失败——它需要 3000 端口上有 API 服务。

## 本地开发环境变量

```dotenv
DATABASE_URL=postgresql://...
ADMIN_PASSWORD=开发环境专用密码
```

**使用独立的 Neon 项目或分支，不要连生产库。**

## API 调试的两种方式

### 方式一：项目自带的 Node 适配器

```bash
npm run serve
```

它把前端和 `api/*` handler 一起托管在 3000 端口，与本地部署的运行方式一致。改完 `api` 下的代码需要重新构建再启动。

### 方式二：Vercel CLI

```bash
npm install --global vercel
vercel login
vercel link
vercel env pull .env.local
vercel dev --listen 3000
```

`.env.local` 包含敏感信息，必须保持在 `.gitignore` 中。

## 分支与预览流程

1. 从最新生产分支创建功能分支；
2. 使用独立开发数据库；
3. 本地执行构建和 API 类型检查；
4. 推送分支，用 Vercel Preview 验收；
5. 确认 Preview **没有**连接生产数据库；
6. 合并后再做生产验收。

## 改代码时的兼容性注意

不要随意重命名这些标识，否则会影响本地缓存、设备绑定和插件兼容：

```text
exam-board-*          localStorage 键
exam-board-offline    IndexedDB 名称
exam-board:*          浏览器事件名
exam-board-shell-*    Service Worker 缓存（旧前缀）
novora-shell-*        当前 Service Worker 缓存前缀
novora-runtime-*      当前运行时缓存前缀
```

同样不要改动现有数据库表和列，以及 ClassIsland 插件的 ID、程序集名和 API 版本逻辑。

## 构建 ClassIsland 插件

```bash
dotnet build integrations/ClassIsland.ExamReminder/ClassIsland.ExamReminder.csproj -c Release
```

生成插件包：

```powershell
dotnet publish -p:CreateCipx=true
```

## 提交前检查

```bash
npm run build
npm run typecheck:api
npm run lint
npm run test
```

全部通过再提 PR。涉及数据库结构改动时，同时补充集成测试场景。

## 相关文档

- 本地运行方式：[Docker Compose 部署](/guide/local/02-docker)｜[无 Docker 部署](/guide/local/03-node)
- 插件接口：[ClassIsland 接口与兼容](/integrations/classisland/03-api)
- 对外集成接口：[考试数据接口](/integrations/02-api)
- 升级兼容：[版本兼容与升级](/appendix/e-version-compatibility)
