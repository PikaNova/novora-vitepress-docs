# 6. 从 Fork 创建 Vercel 项目

本章只从上一章创建的 Fork 导入项目。开始前应已完成 Neon 数据库创建，并准备好 Pooled connection string 和管理员初始密码。恢复密钥会在初始化时自动生成。

## 新建项目

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)。
2. 点击 **Add New... → Project**。
3. 在 GitHub 仓库列表中找到自己的 Novora Fork，例如 `你的用户名/Novora`。
4. 点击该仓库右侧的 **Import**。
5. 如果列表没有仓库，点击 GitHub App 权限设置，授权 Vercel 访问该 Fork 后返回刷新。

::: warning 只导入自己的 Fork
生产项目必须连接自己的 Fork。后续更新会先通过 GitHub 的 **Sync fork** 进入这个仓库，再由 Vercel 自动部署或 Deploy Hook 重新构建。
:::

## 项目基本设置

在 Configure Project 页面检查：

| 设置 | 推荐值 |
| --- | --- |
| Project Name | `novora` 或学校可识别的名称 |
| Framework Preset | `Vite` |
| Root Directory | `./` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | 保持自动检测，通常为 `npm install` |
| Production Branch | `main` |

官方 Fork 的 `package.json` 位于根目录，因此 `Root Directory` 保持 `./`。不要复制其他项目的 Build 设置。

## 首次填写环境变量

在点击 **Deploy** 前，展开 **Environment Variables**，至少添加：

| Name | Value | Environment |
| --- | --- | --- |
| `DATABASE_URL` | Neon 的完整 Pooled connection string | Production，建议同时选择 Preview 和 Development |
| `ADMIN_PASSWORD` | 单独准备的高强度初始管理员密码 | Production，建议同时选择 Preview 和 Development |

不要在 Value 外加引号或空格。`VERCEL_DEPLOY_HOOK_URL` 需要项目创建后才能生成，下一章会单独配置。

## 创建并确认首次部署

1. 检查 Git Repository 显示的是自己的 Fork，Production Branch 是 `main`。
2. 点击 **Deploy**。
3. 等待构建状态变为 **Ready**。
4. 打开分配的预览地址，确认页面能加载；数据库和管理员初始化将在后续章节完成。
5. 继续阅读下一章，创建 Deploy Hook、填写 `VERCEL_DEPLOY_HOOK_URL`，再重新部署一次使变量生效。

## 将 Functions 设置为新加坡

仓库中的 `vercel.json` 已包含：

```json
{
  "regions": ["sin1"]
}
```

这会把服务端 Functions 部署到新加坡。还可在 Vercel 项目 **Settings → Functions → Function Region** 中展开 **Asia Pacific**，选择 **Singapore (`sin1`)**，点击 **Save**，然后创建一次新部署使设置生效。

若页面显示其他区域或 `Overridden`，以仓库 `vercel.json` 的 `sin1` 为准。保存区域后必须重新部署；旧 Deployment 不会迁移。完整截图式步骤见 [Functions 迁移到新加坡](/appendix/f-singapore-functions)。

## 单页应用路由

`vercel.json` 会把网页路径重写到 `index.html`。因此 `/admin`、`/exam`、`/settings` 等 React 路由可以直接刷新。

不要为了修复某个 404 而删除 `/api/:path*` 的重写；API 必须继续由 `api` 目录中的 Functions 处理。

[下一章：配置环境变量 →](/guide/07-environment)
