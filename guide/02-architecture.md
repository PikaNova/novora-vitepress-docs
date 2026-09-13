# 2. 部署原理

无论选云端还是本地，Novora 都由网页、服务端接口和数据库三层组成。理解这三层的关系，有助于在出现错误时快速判断应该检查哪里。

## 两条主线的结构对比

```text
【Vercel 云端】

教师或教室设备
      │
      ▼
自定义域名（例如 exam.example.com）
      │
      ▼
Vercel Edge：返回 React/Vite 构建的网页
      │
      ▼
Vercel Functions：处理 /api/login、/api/exams 等请求
      │
      ▼
Neon PostgreSQL：保存学校、考试、周测、设备和用户数据
```

```text
【本地 / 内网】

教室大屏或教师电脑
      │
      ▼
局域网地址（例如 http://192.168.1.10:3000）
      │
      ▼
Node 进程：同时托管静态网页和 /api/* 接口
      │
      ▼
本机 PostgreSQL：内嵌容器（Docker Compose）或自建实例
```

两套结构的层次完全对应，只是每一层换成了自己管理的组件。因此从云端迁到本地、或从本地迁到云端时，业务代码和数据表结构都不需要改。

浏览器不能直接获得数据库密码。云端部署时 `DATABASE_URL` 只配置在 Vercel 服务端环境变量中，由 Vercel Functions 连接 Neon；本地部署时它保存在服务器的 `.env` 里，由本机 Node 进程读取。

## 源码层：GitHub 与本地仓库

云端部署时，GitHub 保存项目文件。Vercel 与 GitHub 仓库连接后，会在以下情况创建新部署：

- 第一次导入项目；
- 向生产分支推送新提交；
- 在 Vercel 中手动重新部署；
- 使用 Deploy Hook 触发重新部署。

本地部署时，源码同样来自 GitHub，但以 `git clone` 的方式放在服务器目录里；更新靠 `update-local.sh` / `update-local.bat` 或 `git pull` 手动拉取，不经过 Vercel。

GitHub 仓库不是数据库。更新源码不会自动删除数据库中的学校或考试数据。

## 网页与接口层：Vercel Functions 与本地 Node 进程

云端部署时，Vercel 完成两类工作：

1. 执行 `npm run build`，生成浏览器使用的静态文件；
2. 把 `api` 目录中的文件作为服务端 Functions 运行。

项目的 `vercel.json` 已把 Functions 区域固定为新加坡 `sin1`，并配置了单页应用路由回退。因此直接刷新 `/admin` 或 `/exam` 时，正常情况下仍会打开 Novora，而不是显示 404。

本地部署时，这两件事由同一个 Node 进程完成：`server/` 目录里的适配器把 Node 收到的请求转换成 `api/*.ts` handler 认识的形状，因此服务端逻辑与云端完全一致，handler 零改动。

## 数据库层：Neon 与本机 PostgreSQL

云端使用 Neon（托管 PostgreSQL），本地使用内嵌 PostgreSQL 16 或自建实例。两者都是标准 PostgreSQL：Novora 第一次使用管理员密码登录时会自动创建认证相关数据表，首次初始化会写入学校结构和业务设置，**部署者不需要手工建表**。

云端推荐选择：

```text
Provider: AWS
Region: Singapore / ap-southeast-1
Connection: Pooled connection string
```

Vercel Functions 和 Neon 都在新加坡，可以减少跨区域数据库请求延迟。

本地部署没有跨区域问题，但需要自己负责备份和数据卷持久化，具体命令见[更新与维护](/guide/local/06-maintenance)。

## 自定义域名的作用

云端部署时，Vercel 默认提供类似下面的地址：

```text
your-project.vercel.app
```

该地址在中国大陆可能无法正常访问。绑定自己的域名后，用户改为访问：

```text
exam.example.com
```

但 DNS 只改变入口名称，不改变 Vercel 的实际服务器位置。若学校要求严格的大陆可用性或备案，应评估大陆云部署方案，而不是仅依赖更换域名。

本地部署时，内网默认直接使用 `http://服务器IP:3000`；需要域名或 HTTPS 时，要在服务器上自行配置反向代理，见[反向代理与 HTTPS](/guide/local/04-reverse-proxy)。

## 数据保存在哪里

| 数据 | 云端保存位置 | 本地保存位置 |
| --- | --- | --- |
| 学校、年级、班级 | Neon | 本机 PostgreSQL |
| 大型考试和周测 | Neon | 本机 PostgreSQL |
| 管理员用户、角色和审计日志 | Neon | 本机 PostgreSQL |
| 设备云端绑定关系 | Neon | 本机 PostgreSQL |
| 当前浏览器的显示偏好、离线缓存 | 浏览器本地存储和 IndexedDB | 同左 |
| 源代码 | GitHub | GitHub（clone 到服务器） |
| 构建后的网页 | Vercel | 服务器上的 `dist` 与 `server-build` |

清除浏览器缓存可能影响当前设备设置，但不会直接删除数据库中的数据。重建 Vercel 部署也不会清空 Neon。

## 推荐区域

仅云端部署需要考虑区域选择：

```text
中国大陆客户端
  → 自定义域名
  → Vercel Edge
  → Vercel Functions: sin1 新加坡
  → Neon: AWS ap-southeast-1 新加坡
```

[下一章：部署前准备 →](/guide/03-prerequisites)
