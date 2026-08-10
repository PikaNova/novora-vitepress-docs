# 附录 F：本地/内网与 NAS 部署（Docker）

本章介绍不依赖 Vercel 的自托管部署方式，共三条路径：

- **方式一：Docker Compose 内网部署**：应用与内嵌 PostgreSQL 16 在同一套 Compose 中启动，不依赖 Vercel 与 Neon，适合教室局域网、无外网数据库或需要 7×24 运行的场景。
- **方式二：群晖 NAS / Docker 自托管**：在 NAS 或任意支持 Docker 的 Linux 主机上常驻运行，数据库继续使用 Neon 云端 Postgres，适合已有 NAS、想保留云端数据库的学校。
- **无 Docker 运行**：使用 Node.js 22+ 与本机 PostgreSQL 直接运行，适合开发与临时演示。

本地与云端部署共用同一份代码：`server/` 适配器把 Node 请求转换成现有 `api/*.ts` handler 认识的形状，handler 零改动；数据库驱动本身就是标准 PostgreSQL 客户端，只需更换连接串。

## 与云端部署的关系

| 部署方式 | 托管 | 数据库 | 适用场景 |
| --- | --- | --- | --- |
| 云端（默认） | Vercel Functions | Neon PostgreSQL | 公网访问、多校统一管理 |
| 方式一（内网） | 本机或局域网服务器 | 内嵌 PostgreSQL 16 | 教室局域网、无外网、7×24 |
| 方式二（NAS） | 群晖 NAS / Linux 主机 | Neon PostgreSQL | 已有 NAS、保留云端数据库 |

三种方式可以同时存在，互不影响。

## 方式一：Docker Compose 内网部署（推荐，完全离线）

### 前置要求

- 安装 Docker 与 Docker Compose；
- 准备一台可长期开机的电脑或服务器，并规划固定局域网 IP。

### 启动步骤

1. 获取源码并进入仓库目录。
2. 复制环境变量模板：

```bash
cp .env.example .env
```

3. 按需在 `.env` 中填写 `ADMIN_PASSWORD` 等；`DATABASE_URL` 由 Compose 自动注入，可留空。
4. 构建并启动：

```bash
docker compose up -d --build
```

5. 打开 `http://主机局域网IP:3000`，首次使用 `admin` 与 `ADMIN_PASSWORD` 登录，随后完成初始化并保存恢复密钥。

- 数据持久化在 Docker 卷 `novora_pgdata`，删除容器不会丢数据；
- 首次启动会自动创建全部数据表，无需手工执行 SQL；
- 常用命令：`docker compose up -d --build`、`docker compose down`、`docker compose logs -f app`。

## 方式二：群晖 NAS / Docker 自托管（数据库继续用 Neon）

本方式面向 fork 了 Novora 仓库、希望在群晖 NAS（或任何支持 Docker 的 Linux 主机）上自托管部署的用户。NAS 上只运行一个常驻服务，托管前端静态资源并挂载全部 API 路由。

### 前置条件

- 已在 [Neon](https://neon.tech) 创建项目，并拿到 Pooled connection string（`DATABASE_URL`）；
- NAS 已安装群晖 **Container Manager**（DSM 7.2+）或任意 Docker / Docker Compose 环境；
- 建议准备好一个域名，用于后续反向代理 + HTTPS。

### 第一步：获取代码

将仓库（包含 `server/` 适配器、`Dockerfile`、`docker-compose.yml` 等自托管部署文件）克隆或下载到 NAS，例如通过群晖 **Git Server** 套件，或在本地打包后用 File Station 上传。

### 第二步：配置环境变量

复制 `.env.example` 为 `.env`，填写：

```text
DATABASE_URL=你的 Neon Pooled 连接串
ADMIN_PASSWORD=至少8位强密码
PORT=3000
```

`.env` 文件不要提交到 Git 仓库。

### 第三步：用 Container Manager 构建并启动

1. 打开 **Container Manager → 项目 → 新增**。
2. 项目来源选择 `docker-compose.yml`，路径指向项目文件夹（其中已包含 `Dockerfile`、`docker-compose.yml`、`.env`）。
3. 点击完成，Container Manager 会自动执行多阶段构建：
   - 阶段一：`npm install` → `npm run build`（生成前端 `dist/`）→ 编译服务端（`tsc -p tsconfig.server.json`）；
   - 阶段二：只安装生产依赖，拷贝构建产物，启动服务进程，监听容器内 `3000` 端口。
4. 构建完成后容器自动启动，`restart: unless-stopped` 保证 NAS 重启后自动拉起。

也可以用命令行方式（NAS 已开启 SSH）：

```bash
cd /volume1/docker/novora
docker compose up -d --build
```

### 第四步：反向代理 + HTTPS

1. **控制面板 → 登录门户 → 反向代理 → 新增**：把域名（如 `novora.example.com`）转发到 NAS 本机的 `3000` 端口（容器映射出来的端口）。
2. 在反向代理规则的「自定义标头」中，确保转发 `X-Forwarded-Host` 与 `X-Forwarded-Proto`。项目的同源与 CORS 校验依赖这两个头，配置不当可能出现接口被拒绝的情况。
3. **控制面板 → 安全性 → 证书**：申请 Let's Encrypt 证书并绑定到上面的反向代理规则，启用 HTTPS。
4. 如需公网访问，在路由器上做端口转发（443/80），或使用群晖 QuickConnect / DDNS。

### 第五步：首次初始化

打开 `https://你的域名/login`，使用用户名 `admin`、密码为 `.env` 中设置的 `ADMIN_PASSWORD` 登录，按向导完成省份、学校、年级班级、学期等初始化配置。首次初始化会生成只显示一次的恢复密钥，请务必妥善保存。

### 升级与维护

```bash
git pull
docker compose up -d --build
```

即可完成滚动升级，无需重新配置环境变量或重新走初始化流程。

## 无 Docker 本地运行

要求 Node.js 22+ 与 PostgreSQL 14+（本机或内网实例）：

1. 创建数据库并准备连接串。
2. 复制 `.env.example` 为 `.env`，填写 `DATABASE_URL`、`ADMIN_PASSWORD`。
3. 安装依赖并启动：

```bash
npm install
npm run serve
```

4. 访问 `http://localhost:3000`（或局域网 IP）。

`npm run serve` 会先构建前端与 server，再启动单个 Node 进程托管静态站点和全部 API。

## 初始化与日常使用

自托管部署的登录、初始化、恢复密钥、考试与周测管理等流程与云端完全一致：

- 首次登录自动建表并创建内置角色与超级管理员；
- 完成初始化向导并保存只显示一次的恢复密钥；
- 忘记密码时使用恢复密钥，或由上级管理员重置。

## 一键更新

- 方式一（内网）：Windows 双击 `update-local.bat`；Linux / macOS 执行 `./update-local.sh`；或手动执行 `npm run update:local`。更新脚本会拉取最新代码、重新构建并重启本地服务。
- 方式二（NAS）：在 NAS 上执行 `git pull` 后 `docker compose up -d --build`。

更新前建议备份数据库。

## 常见问题

- **`VERCEL_DEPLOY_HOOK_URL` 要不要配置？** 不需要。这是 Vercel 专属的一键重新部署钩子，自托管环境不需要，未配置时前端相关按钮会自动隐藏。
- **必须要能访问公网吗？** 核心的排考、大屏、管理后台功能不需要公网。`telemetry`、`error-report`、`announcement-images`、`update-check` 等辅助功能需要访问外部服务和 GitHub，纯内网环境下这些功能会自动降级跳过，不影响核心功能。
- **能否完全脱离 Neon，把数据库也放在本机？** 方式一（内嵌 PostgreSQL 16）可以完全脱离 Neon。方式二使用的 `@neondatabase/serverless` 驱动专门对接 Neon 代理协议，若要在 NAS 上改用本地 Postgres，需要更换为标准 `pg` / `postgres.js` 驱动并调整查询代码，属于代码层面改造。

## 注意事项

- 数据备份：定期备份 Docker 卷或使用 `pg_dump`；更新前先备份；
- 端口：默认 3000，可在 `.env` 或 Compose 中调整；
- HTTPS：内网使用 HTTP 即可；公网访问请配置反向代理 + HTTPS；
- 与云端共存：同一仓库、同一 handler，切换部署只需更换 `DATABASE_URL`。
