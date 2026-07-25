# 6. 配置 Vercel 项目

本章优先使用官方仓库的一键部署按钮。开始前应已完成 Neon 项目创建，并准备好 Pooled connection string 和管理员初始密码。恢复密钥会在初始化时自动生成。

## 一键部署（推荐）

1. 登录 GitHub 和 [Vercel](https://vercel.com/)。
2. 打开 [PikaNova/Novora](https://github.com/PikaNova/Novora)。
3. 在 README 顶部“一键部署”区域点击按钮：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3a%2f%2fgithub.com%2fPikaNova%2fNovora&project-name=novora-board&repository-name=novora-board&env=DATABASE_URL,ADMIN_PASSWORD&envDescription=请填写%20Neon%20PostgreSQL%20连接字符串和超级管理员初始密码)

4. Vercel 要求登录或授权 GitHub 时，按页面提示完成授权。
5. 确认创建的 GitHub Repository Name 和 Vercel Project Name，默认都是 `novora-board`。
6. 在 `DATABASE_URL` 中粘贴 Neon 完整 Pooled connection string。
7. 在 `ADMIN_PASSWORD` 中填写准备好的初始管理员密码。
8. 点击 **Deploy**，等待首次构建完成。
9. 按下一章创建 Deploy Hook、填写 `VERCEL_DEPLOY_HOOK_URL` 并重新部署。完成这一步后才算满足正式部署的必填配置。

Deploy Hook 依赖已经存在的 Vercel 项目，因此无法在一键部署的第一屏提供真实值。这是唯一的两阶段配置项，完整步骤见下一章。

::: tip 一键部署后的仓库属于你
Vercel 会在你的 Git 服务账号下创建克隆仓库，之后每次向该仓库生产分支提交代码，都会触发新的 Vercel 部署。
:::

## 手动导入 GitHub 仓库（备用）

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

一键部署会读取仓库配置，通常不需要手动修改这些项目设置。

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

`vercel.json` 还把网页路径重写到 `index.html`。因此 `/admin`、`/exam`、`/settings` 等 React 路由可以直接刷新。

不要为了修复某个 404 而删除 `/api/:path*` 的重写；API 必须继续由 `api` 目录中的 Functions 处理。

## 手动部署时暂时不要点击 Deploy

在 Configure Project 页面展开 **Environment Variables**，继续阅读下一章并先填写必需变量。没有 `DATABASE_URL` 和 `ADMIN_PASSWORD` 的构建可能成功，但登录与数据保存无法正常工作。

## 已经误点 Deploy 怎么办

不需要删除项目：

1. 等待部署结束。
2. 打开项目的 **Settings → Environment Variables**。
3. 添加下一章要求的变量。
4. 回到 **Deployments**。
5. 对最新部署执行 **Redeploy**。

[下一章：配置环境变量 →](/guide/07-environment)
