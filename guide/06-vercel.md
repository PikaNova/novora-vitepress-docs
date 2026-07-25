# 6. 配置 Vercel 项目

本章把 GitHub 中的源码导入 Vercel。先完成项目配置，下一章再填写环境变量。

## 导入 GitHub 仓库

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)。
2. 点击 **Add New... → Project**。
3. 在仓库列表中找到自己的 `Novora` 仓库。
4. 点击仓库右侧的 **Import**。

如果找不到仓库，点击调整 GitHub App 权限，允许 Vercel 访问该仓库，然后返回重新选择。

## 项目基本设置

在 Configure Project 页面检查：

| 设置 | 推荐值 |
| --- | --- |
| Project Name | `novora` 或自定义名称 |
| Framework Preset | `Vite` |
| Root Directory | 包含 `package.json` 的目录 |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | 保持自动检测，通常为 `npm install` |

如果 GitHub 仓库根目录直接包含 `package.json`，Root Directory 保持 `./`。如果源码位于仓库的 `Novora` 子目录，点击 **Edit** 并选择该子目录。

## 不要改 Functions 区域

仓库中的 `vercel.json` 已包含：

```json
{
  "regions": ["sin1"]
}
```

这会把服务端 Functions 部署到新加坡。不要在不理解影响时删除此配置，否则 Functions 与 Neon 可能跨区域通信。

## 单页应用路由

`vercel.json` 还把网页路径重写到 `index.html`。因此 `/admin`、`/exam`、`/settings` 等 React 路由可以直接刷新。

不要为了修复某个 404 而删除 `/api/:path*` 的重写；API 必须继续由 `api` 目录中的 Functions 处理。

## 暂时不要点击 Deploy

在 Configure Project 页面展开 **Environment Variables**，继续阅读下一章并先填写必需变量。没有 `DATABASE_URL` 和 `ADMIN_PASSWORD` 的构建可能成功，但登录与数据保存无法正常工作。

## 已经误点 Deploy 怎么办

不需要删除项目：

1. 等待部署结束。
2. 打开项目的 **Settings → Environment Variables**。
3. 添加下一章要求的变量。
4. 回到 **Deployments**。
5. 对最新部署执行 **Redeploy**。

[下一章：配置环境变量 →](/guide/07-environment)
