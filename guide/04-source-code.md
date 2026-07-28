# 4. Fork 作者仓库

Novora 的正式部署统一使用自己的 Fork 仓库，再由 Vercel 导入这个 Fork 创建项目。这样可以保留清晰、可持续的上游同步流程，后续能可靠获取作者仓库更新。

## Fork 前确认

请先登录 GitHub，并打开作者仓库：[PikaNova/Novora](https://github.com/PikaNova/Novora)。Fork 后的仓库归你的 GitHub 账号或学校组织所有；Vercel 以后只连接这个仓库的 `main` 分支。

::: tip 为什么必须 Fork
Fork 会保留与 `PikaNova/Novora` 的上游关系。作者发布新版后，你可以在 GitHub 使用 **Sync fork** 把更新合并到自己的 `main`，Vercel 才能构建新代码。Deploy Hook 只能重新部署已有代码，不能代替同步上游。
:::

## 创建 Fork

1. 在 [PikaNova/Novora](https://github.com/PikaNova/Novora) 页面右上角点击 **Fork**。
2. `Owner` 选择自己的 GitHub 账号，或学校的 GitHub Organization。
3. 仓库名称建议保留为 `Novora`；如需区分学校实例，可改为 `school-novora`。
4. 保持默认分支 `main` 被包含，不需要勾选额外模板选项。
5. 点击 **Create fork**，等待 GitHub 跳转到新仓库。
6. 确认仓库页显示 `forked from PikaNova/Novora`，并且当前分支为 `main`。

Fork 后地址类似：

```text
https://github.com/你的用户名/Novora
```

## 检查仓库根目录

Fork 首页应直接看到以下文件或目录：

```text
api/
public/
src/
index.html
package.json
vercel.json
vite.config.ts
```

`package.json` 必须位于将要交给 Vercel 的仓库根目录。官方 Fork 的根目录已经正确；不要再套一层 `Novora` 文件夹，也不要上传 `node_modules`、`.env` 或数据库连接串。

## 自定义代码的处理方式

需要修改校名、功能或样式时，先在自己的 Fork 创建分支完成修改和测试，再合入 `main`。不要直接改作者仓库，也不要为了更新使用会覆盖自定义提交的强制命令。

后续更新时，先同步作者上游，再处理与学校自定义代码的冲突。完整步骤见[日常维护](/guide/12-maintenance)。

## 完成标志

确认浏览器地址是自己的 Fork，仓库页显示来源 `PikaNova/Novora`，且能看到 `package.json`、`api`、`src` 与 `vercel.json`。下一章将把这个 Fork 导入 Vercel 并创建正式项目。

[下一章：创建 Neon 数据库 →](/guide/05-neon)
