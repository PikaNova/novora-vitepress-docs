# Novora VitePress 文档

这是一套可独立运行的 VitePress 文档站，包含 12 篇部署文档、10 篇功能使用文档和 6 篇附录，内容以 Novora V2.5.6 正式版为基准。

文档地址 <https://docs.pikachu2026.space>

**官方问题反馈与部署交流群：`1067566386`**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3a%2f%2fgithub.com%2fPikaNova%2fNovora&project-name=novora-board&repository-name=novora-board&env=DATABASE_URL,ADMIN_PASSWORD)

简易流程：创建 Neon 新加坡数据库 → 一键部署 → 创建 `main` Deploy Hook 并填写 `VERCEL_DEPLOY_HOOK_URL` → Redeploy → 从首页初始化并保存自动恢复密钥。完整步骤从文档首页进入。

- [创建 Vercel Deploy Hook 并填写环境变量](./guide/07-environment.md#创建-deploy-hook正式部署必做)
- [后续版本完整更新、验收与回滚流程](./guide/12-maintenance.md)

## 本地运行

```bash
npm install
npm run docs:dev
```

浏览器打开终端显示的本地地址，默认通常为 `http://localhost:5173`。

## 生产构建

```bash
npm run build
```

构建结果位于 `.vitepress/dist`。如需本地检查构建结果：

```bash
npm run docs:preview
```

## 部署到 Vercel

仓库已包含 `vercel.json`，会固定使用以下配置：

```text
Build Command: npm run build
Output Directory: .vitepress/dist
```

将仓库导入 Vercel 后直接部署即可。如果旧项目部署成功后显示 Vercel 404，请执行：

1. 把本仓库新增的 `vercel.json` 和 `package.json` 提交到 GitHub；
2. 打开 Vercel 项目的 **Settings → Build and Deployment**；
3. 确认 Output Directory 是 `.vitepress/dist`，不是 `dist`；
4. 回到 **Deployments**，对最新提交执行 Redeploy；
5. 重新部署时可取消使用旧 Build Cache。

构建日志中的 `Ignored build scripts: esbuild` 警告不是此次 404 的原因；只要后续出现 `build complete` 和 `Deployment completed`，应继续检查发布输出目录。

## 导入现有 VitePress

如果已有文档站，可合并 `guide`、`appendix` 和 `public` 目录，再把 `.vitepress/config.mts` 中的导航及侧边栏项目合并到现有配置。不要直接覆盖已有配置。
