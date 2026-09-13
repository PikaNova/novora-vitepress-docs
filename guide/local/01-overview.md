# 1. 本地部署总览

本地/内网部署把网页、服务端接口和数据库全部放在学校自己能控制的机器上，不依赖 Vercel 与 Neon。适合教室局域网、无外网数据库、要求数据不出校内的场景。

## 两种方式

| 对比项 | 方式一：Docker Compose | 方式二：无 Docker（Node） |
| --- | --- | --- |
| 数据库 | Compose 内嵌 PostgreSQL 16 容器 | 本机或内网 PostgreSQL 14+ |
| 需要安装 | Docker + Docker Compose | Node.js 22+ 与 PostgreSQL |
| 启动命令 | `docker compose up -d --build` | `npm install && npm run serve` |
| 数据持久化 | Docker 卷 `novora_pgdata` | PostgreSQL 数据目录 |
| 升级方式 | `git pull` + `docker compose up -d --build` | `npm run update:local` |
| 隔离性 | 应用与数据库都在容器里，删除容器不影响数据卷 | 依赖本机环境，升级 Node 或系统可能影响运行 |
| 推荐程度 | **推荐**，完全离线也能运行 | 适合开发调试或已有 PostgreSQL 的环境 |

新手直接选方式一。方式二更适合已经在跑 PostgreSQL、或需要频繁改代码的场景。

## 前置要求

**通用**

- 一台可长期开机的电脑或服务器（教室机、NAS、机房主机均可）；
- 规划固定局域网 IP，例如 `192.168.1.10`，避免重启后地址变化导致大屏失联；
- 能从 GitHub 拉取源码：初始化时联网一次即可，之后可完全离线运行。

**方式一**

```bash
docker --version
docker compose version
```

两条命令都能输出正常版本号即可。没有安装 Docker 时，按对应系统下载 Docker Desktop（Windows / macOS）或 Docker Engine（Linux）。

**方式二**

```bash
node --version    # 需要 v22 或更高
psql --version    # 需要 PostgreSQL 14 或更高
```

## 与云端部署的关系

两种部署方式共用同一份代码、同一套数据表结构。区别只在运行环境：

| 主题 | Vercel 云端 | 本地 / 内网 |
| --- | --- | --- |
| 网页与接口 | Vercel Functions + Edge | 本机 Node 进程 |
| 数据库 | Neon | 内嵌 PostgreSQL 16 或自建实例 |
| 更新方式 | Sync fork + Vercel 自动部署 | `update-local.sh` / `.bat` |
| 环境变量 | `DATABASE_URL`、`ADMIN_PASSWORD`、`VERCEL_DEPLOY_HOOK_URL` | `ADMIN_PASSWORD`（无 Docker 时再加 `DATABASE_URL`） |
| 访问入口 | 自定义域名 | 局域网 IP，或自建反向代理 + 域名 |

同一份源码可以同时部署云端和本地两套实例，互不影响。如果你还没决定用哪种方式，先回到[选择部署方式](/guide/00-deploy-paths)。

## 本地部署不需要什么

- 不需要注册 Neon、Vercel 账号；
- 不需要配置 `VERCEL_DEPLOY_HOOK_URL`（后台相关按钮会自动隐藏）；
- 不需要公网 IP。核心的排考、大屏、管理后台功能在纯内网可用。

## 内网环境下会自动降级的功能

下列功能需要访问外部服务，纯内网环境下会自动跳过，不影响核心使用：

```text
telemetry        遥测上报
error-report     错误上报
announcement-images  公告图片
update-check     版本检查
```

需要在纯内网环境提供这些能力时，需要在服务器上放通对应的出网规则，或自建对应的服务端（见 Vercel 环境变量文档中的遥测覆盖变量）。

## 下一步

1. 已装好 Docker → 进入[Docker Compose 部署](/guide/local/02-docker)
2. 想用本机 Node 与 PostgreSQL → 进入[无 Docker 部署](/guide/local/03-node)
3. 需要域名或公网访问 → 部署完成后读[反向代理与 HTTPS](/guide/local/04-reverse-proxy)
4. 部署完成 → 读[初始化与验收](/guide/local/05-acceptance)
