# 5. 创建 Neon 数据库

Neon 用来保存 Novora 的学校结构、考试安排、设备绑定和管理员账户。本章只创建数据库，不需要手工创建数据表。

## 创建项目

1. 打开 [Neon Console](https://console.neon.tech/) 并登录。
2. 点击 **New Project** 或 **Create a project**。
3. 项目名称可填写 `novora-production`。
4. Provider 选择 **AWS**。
5. Region 选择 **Singapore / ap-southeast-1**。
6. PostgreSQL 版本保持平台默认值。
7. 点击创建并等待项目就绪。

::: tip 为什么选择新加坡
Novora 的 `vercel.json` 已将 Vercel Functions 固定在 `sin1` 新加坡。数据库也选择新加坡，可以避免每次 API 请求跨洲访问数据库。
:::

## 获取连接串

项目创建完成后，在 Neon 的 **Connection Details** 或 **Connect** 区域：

1. Branch 选择生产分支，通常为 `main`。
2. Database 选择默认数据库，通常为 `neondb`。
3. Role 使用自动创建的数据库角色。
4. 连接类型选择 **Pooled connection**。
5. 复制完整连接串。

连接串外观类似：

```text
postgresql://用户名:密码@ep-xxxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

不同项目的主机名、用户名和密码都不同。教程中的示例不能直接使用。

## 确认是 Pooled 连接

推荐连接串的主机名通常包含 `-pooler`。如果 Neon 页面提供了 **Direct connection** 和 **Pooled connection**，必须复制 Pooled 版本。

Vercel Functions 会按请求启动和释放实例。使用连接池可以减少短时间大量连接对数据库的压力。

## 保存连接串

将连接串暂时保存在密码管理器或其他安全位置，下一章填写到 Vercel 的 `DATABASE_URL`。

::: danger 数据库连接串等同于密码
任何获得连接串的人都可能访问或修改数据库。不要把它提交到 GitHub，不要放进公开截图，也不要通过公开聊天发送。
:::

## 不需要手工建表

首次管理员登录时，Novora 会自动建立认证表、四个内置角色和超级管理员。业务数据结构也会在首次 API 使用时按代码要求建立或补齐。

不要从来源不明的教程复制 SQL 到 Neon SQL Editor。手工创建错误字段可能导致后续自动升级失败。

## 完成标志

- [ ] Neon 项目已创建
- [ ] 区域为 AWS Singapore
- [ ] 已复制 Pooled connection string
- [ ] 连接串保留了 `sslmode=require` 等 SSL 参数
- [ ] 连接串没有提交到 GitHub

[下一章：配置 Vercel 项目 →](/guide/06-vercel)
