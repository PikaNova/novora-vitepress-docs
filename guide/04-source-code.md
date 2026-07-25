# 4. 获取项目源码

推荐通过 GitHub Fork 获取源码。这样既能保留上游项目来源，也方便 Vercel 自动构建和后续更新。

## 方法一：Fork 仓库（推荐）

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

## 方法二：上传 ZIP 源码

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

当你能在自己的 GitHub 仓库首页看到 `package.json`、`api`、`src` 和 `vercel.json` 时，本章完成。

[下一章：创建 Neon 数据库 →](/guide/05-neon)
