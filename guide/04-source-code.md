# 4. 获取项目源码

零基础部署推荐使用仓库 README 中的 **Deploy with Vercel** 一键部署按钮，它会自动克隆源码并创建 Vercel 项目。手动 Fork 仍保留为需要自定义仓库名称、私有仓库或修改代码时的备用方式。

## 方法一：一键部署自动克隆（推荐）

打开 [PikaNova/Novora](https://github.com/PikaNova/Novora)，在 README 顶部找到“一键部署”：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3a%2f%2fgithub.com%2fPikaNova%2fNovora&project-name=novora-board&repository-name=novora-board&env=DATABASE_URL,ADMIN_PASSWORD,ADMIN_RECOVERY_KEY&envDescription=请填写%20Neon%20PostgreSQL%20连接字符串、超级管理员初始密码和应急恢复密钥)

该按钮会自动：

- 从官方仓库克隆当前源码；
- 在你的 Git 服务账号下创建 `novora-board` 仓库；
- 创建同名 Vercel 项目；
- 要求填写 `DATABASE_URL`、`ADMIN_PASSWORD` 和 `ADMIN_RECOVERY_KEY`；
- 使用仓库中的 Vite 和 `vercel.json` 配置执行部署。

此时先不要点击按钮。完成下一章的 Neon 数据库创建并取得 Pooled connection string 后，再按[配置 Vercel 项目](/guide/06-vercel)执行一键部署。

::: warning 一键部署不等于自动准备数据库
按钮不会替你创建 Neon 项目，也不会生成管理员密码或恢复密钥。三个值仍需由部署者提前准备并妥善保管。
:::

## 方法二：手动 Fork 仓库

1. 登录 GitHub。
2. 打开 [PikaNova/Novora](https://github.com/PikaNova/Novora)。
3. 点击页面右上角的 **Fork**。
4. `Owner` 选择自己的 GitHub 账号。
5. 仓库名称可保留 `Novora`。
6. 点击 **Create fork**。
7. 等待 GitHub 跳转到你自己的仓库页面。

Fork 后，浏览器地址应类似：

```text
https://github.com/你的用户名/Novora
```

## 检查仓库根目录

仓库首页应直接看到以下文件或目录：

```text
api/
public/
src/
index.html
package.json
vercel.json
vite.config.ts
```

`package.json` 必须位于准备交给 Vercel 的根目录。如果这些文件又被包在一层 `Novora` 文件夹中，Vercel 导入时需要指定 Root Directory。

## 方法三：上传 ZIP 源码

只有无法 Fork 或使用非官方源码包时才使用此方法。

1. 在 GitHub 新建一个空仓库。
2. 不要预先创建会覆盖源码的同名文件。
3. 在电脑上解压源码 ZIP。
4. 确认解压目录中直接存在 `package.json`。
5. 将项目文件提交到新仓库。

::: warning 不要上传这些内容
不要上传 `node_modules`、`.env`、`.env.local`、数据库连接串、管理员密码或构建日志。源码包里如果包含这些内容，应先移除敏感信息。
:::

## 私有还是公开

Novora 仓库可以设为公开或私有。使用私有仓库时：

- Vercel 必须被授权读取该仓库；
- 项目更新检查若要访问私有 GitHub Release，通常需要配置 `GITHUB_TOKEN`；
- 不要因为仓库是私有的，就把密码直接写进源码。

## 不要批量替换内部名称

即使修改了对外产品名，也不要批量替换以下兼容标识：

- `exam-board-*` 本地存储键；
- `exam-board-offline` IndexedDB 名称；
- `exam-board:*` 浏览器事件名；
- `exam-board-shell-*` Service Worker 缓存前缀；
- ClassIsland 插件 ID `classisland.exam-reminder`；
- 已存在的 Neon 表名和字段名。

这些名称用于数据兼容，不只是界面品牌文字。

## 完成标志

使用一键部署时，了解按钮会创建自己的仓库即可；手动方式则应确认仓库首页能看到 `package.json`、`api`、`src` 和 `vercel.json`。

[下一章：创建 Neon 数据库 →](/guide/05-neon)
