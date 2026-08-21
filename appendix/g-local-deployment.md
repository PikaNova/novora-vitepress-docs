# 附录 F：本地/内网部署（Docker）

本章介绍不依赖 Vercel 的自托管部署方式，共两条路径：

- **方式一：Docker Compose 内网部署**：应用与内嵌 PostgreSQL 16 在同一套 Compose 中启动，不依赖 Vercel 与 Neon，适合教室局域网、无外网数据库或需要 7×24 运行的场景。
- **无 Docker 运行**：使用 Node.js 22+ 与本机 PostgreSQL 直接运行，适合开发与临时演示。

本地与云端部署共用同一份代码：`server/` 适配器把 Node 请求转换成现有 `api/*.ts` handler 认识的形状，handler 零改动；数据库驱动本身就是标准 PostgreSQL 客户端，只需更换连接串。

## 与云端部署的关系

| 部署方式 | 托管 | 数据库 | 适用场景 |
| --- | --- | --- | --- |
| 云端（默认） | Vercel Functions | Neon PostgreSQL | 公网访问、多校统一管理 |
| 本地/内网 | 本机或局域网服务器 | 内嵌 PostgreSQL 16 | 教室局域网、无外网、7×24 |

两种方式可以同时存在，互不影响。

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

## 配置反向代理（公网或域名访问时推荐）

默认通过 `http://服务器IP:3000` 提供内网访问。需要域名或 HTTPS 时，在服务器上配置反向代理，把流量转发到 `3000` 端口：

- 使用 Nginx、Caddy 或服务器上已有的反向代理服务；
- **必须转发 `X-Forwarded-Host` 与 `X-Forwarded-Proto`**，项目的同源与 CORS 校验依赖这两个头，配置不当可能出现接口被拒绝；
- 启用 HTTPS（例如 Let's Encrypt 证书），并把公网 443/80 端口转发到反向代理。

Nginx 示例：

```nginx
server {
  listen 443 ssl;
  server_name novora.example.com;
  ssl_certificate     /etc/letsencrypt/live/novora.example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/novora.example.com/privkey.pem;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

也可以使用 Caddy，一行即可并自动申请与续期 HTTPS 证书：

```text
novora.example.com {
    reverse_proxy 127.0.0.1:3000
}
```

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

本地部署的登录、初始化、恢复密钥、考试与周测管理等流程与云端完全一致：

- 首次登录自动建表并创建内置角色与超级管理员；
- 完成初始化向导并保存只显示一次的恢复密钥；
- 忘记密码时使用恢复密钥，或由上级管理员重置。

## 一键更新

- Windows 双击 `update-local.bat`；
- Linux / macOS 执行 `./update-local.sh`；
- 或手动执行 `npm run update:local`。

更新脚本会拉取最新代码、重新构建并重启本地服务。更新前建议备份数据库。

## 常见问题

- **`VERCEL_DEPLOY_HOOK_URL` 要不要配置？** 不需要。这是 Vercel 专属的一键重新部署钩子，自托管环境不需要，未配置时前端相关按钮会自动隐藏。
- **必须要能访问公网吗？** 核心的排考、大屏、管理后台功能不需要公网。`telemetry`、`error-report`、`announcement-images`、`update-check` 等辅助功能需要访问外部服务和 GitHub，纯内网环境下这些功能会自动降级跳过，不影响核心功能。
- **能否完全脱离 Neon，把数据库也放在本机？** 可以。方式一使用内嵌 PostgreSQL 16；无 Docker 方式使用标准 `pg` 驱动直连本机 PostgreSQL。两者都不依赖 Vercel 与 Neon。
- **配置反向代理后接口被拒绝？** 检查反向代理是否转发 `X-Forwarded-Host` 与 `X-Forwarded-Proto`，以及 `Host` 头是否保持为你的域名。

## 注意事项

- 数据备份：定期备份 Docker 卷或使用 `pg_dump`；更新前先备份；
- 端口：默认 3000，可在 `.env` 或 Compose 中调整；
- HTTPS：公网访问务必配置反向代理 + HTTPS；
- 与云端共存：同一仓库、同一 handler，切换部署只需更换 `DATABASE_URL`。
