# 2. 部署原理

部署 Novora 不需要自己管理传统服务器，但仍然包含网页、服务端接口和数据库三层。理解它们的关系，有助于在出现错误时快速判断应该检查哪里。

## 一次访问经过什么

```text
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

浏览器不能直接获得数据库密码。`DATABASE_URL` 只配置在 Vercel 服务端环境变量中，由 Vercel Functions 连接 Neon。

## GitHub 的作用

GitHub 保存项目文件。Vercel 与 GitHub 仓库连接后，会在以下情况创建新部署：

- 第一次导入项目；
- 向生产分支推送新提交；
- 在 Vercel 中手动重新部署；
- 使用 Deploy Hook 触发重新部署。

GitHub 仓库不是数据库。更新源码不会自动删除 Neon 中的学校或考试数据。

## Vercel 的作用

Vercel 完成两类工作：

1. 执行 `npm run build`，生成浏览器使用的静态文件；
2. 把 `api` 目录中的文件作为服务端 Functions 运行。

项目的 `vercel.json` 已把 Functions 区域固定为新加坡 `sin1`，并配置了单页应用路由回退。因此直接刷新 `/admin` 或 `/exam` 时，正常情况下仍会打开 Novora，而不是显示 404。

## Neon 的作用

Neon 是云端 PostgreSQL。Novora 第一次使用管理员密码登录时，会自动创建认证相关数据表；首次初始化会写入学校结构和业务设置。部署者不需要手工建表。

推荐选择：

```text
Provider: AWS
Region: Singapore / ap-southeast-1
Connection: Pooled connection string
```

Vercel Functions 和 Neon 都在新加坡，可以减少跨区域数据库请求延迟。

## 自定义域名的作用

Vercel 默认提供类似下面的地址：

```text
your-project.vercel.app
```

该地址在中国大陆可能无法正常访问。绑定自己的域名后，用户改为访问：

```text
exam.example.com
```

但 DNS 只改变入口名称，不改变 Vercel 的实际服务器位置。若学校要求严格的大陆可用性或备案，应评估大陆云部署方案，而不是仅依赖更换域名。

## 数据保存在哪里

| 数据 | 保存位置 |
| --- | --- |
| 学校、年级、班级 | Neon |
| 大型考试和周测 | Neon |
| 管理员用户、角色和审计日志 | Neon |
| 设备云端绑定关系 | Neon |
| 当前浏览器的显示偏好、离线缓存 | 浏览器本地存储和 IndexedDB |
| 源代码 | GitHub |
| 构建后的网页 | Vercel |

清除浏览器缓存可能影响当前设备设置，但不会直接删除 Neon 中的数据。重建 Vercel 部署也不会清空 Neon。

## 推荐区域

```text
中国大陆客户端
  → 自定义域名
  → Vercel Edge
  → Vercel Functions: sin1 新加坡
  → Neon: AWS ap-southeast-1 新加坡
```

[下一章：部署前准备 →](/guide/03-prerequisites)
