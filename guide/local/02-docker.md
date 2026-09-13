# 2. Docker Compose 部署

本篇用 Docker Compose 同时启动 Novora 应用和内嵌 PostgreSQL 16。启动完成后，应用和数据库都在容器里，删除容器不会丢失数据（数据保存在 Docker 卷）。

::: tip 完全离线可用
只有首次 `git clone` 和 `docker compose up --build` 需要联网。之后即使服务器不能访问外网，排考、大屏和管理后台仍然正常工作。
:::

## 前置要求

- 已安装 Docker 与 Docker Compose；
- 一台可长期开机的电脑或服务器，已规划固定局域网 IP；
- 服务器防火墙或安全组已放行 `3000` 端口（或你在 `.env` 中改的端口）。

## 第一步：检查 Docker 环境

```bash
docker --version
docker compose version
```

两条命令都能输出版本号即可。如果提示 `docker: command not found`，先完成 Docker 安装再继续。

## 第二步：拉取源码

```bash
sudo mkdir -p /opt/novora
cd /opt/novora
sudo git clone https://github.com/你的用户名/Novora.git .
# 没有 Fork 时可用官方仓库：
# sudo git clone https://github.com/PikaNova/Novora.git .
```

推荐使用自己的 Fork，方便后续在 Fork 上合并上游更新（本地更新主要靠 `git pull`，Fork 不是必须，但能让改动有落脚点）。

## 第三步：准备环境变量

```bash
sudo cp .env.example .env
sudo nano .env
```

`.env` 中需要修改的关键项：

```text
ADMIN_PASSWORD=你的强密码   # 至少 8 位，建议 12 位以上
PORT=3000                  # 可选，默认 3000
# DATABASE_URL 留空：Compose 会自动注入内嵌 PostgreSQL 地址
# 可选：POSTGRES_USER / POSTGRES_PASSWORD / POSTGRES_DB（默认 novora / novora / novora）
VITE_SPEED_INSIGHTS=false  # 本地部署保持 false
```

修改 `POSTGRES_PASSWORD` 时务必同步确认，默认值只适合内网隔离环境。生产使用建议改成独立强密码。

## 第四步：构建并启动

```bash
sudo docker compose up -d --build
```

首次构建需要下载基础镜像并安装依赖，通常几分钟。看到所有容器状态为 `running` 即启动成功。

## 第五步：查看状态与日志

```bash
sudo docker compose ps
sudo docker compose logs -f app   # Ctrl+C 退出日志
```

`app` 是应用容器，`db` 是数据库容器。应用启动时会等待数据库就绪，日志中出现监听端口信息即可访问。

## 第六步：访问并完成初始化

1. 浏览器打开 `http://服务器局域网IP:3000`；
2. 首次使用 `admin` 与 `.env` 中的 `ADMIN_PASSWORD` 登录；
3. 按向导完成初始化；
4. 最后一步会生成只显示一次的恢复密钥，请务必保存到可信位置。

初始化流程与云端完全一致，详细说明见[初始化与验收](/guide/local/05-acceptance)。

## 数据保存在哪里

| 内容 | 位置 | 说明 |
| --- | --- | --- |
| 数据库数据 | Docker 卷 `novora_pgdata` | 删除容器不丢数据，删除卷才会丢 |
| 应用配置 | `.env` | 保存端口、密码、数据库账号 |
| 源码 | `/opt/novora` | 更新时 `git pull` |

首次启动会自动创建全部数据表，无需手工执行 SQL。

## 常用维护命令

```bash
# 停止（数据保留）
sudo docker compose down

# 再次启动
sudo docker compose up -d

# 更新到最新代码并重新构建
cd /opt/novora
sudo git pull
sudo docker compose up -d --build

# 查看数据卷
sudo docker volume ls

# 备份数据库
sudo docker compose exec db pg_dump -U novora -d novora -F c -f /tmp/novora.dump
sudo docker compose cp db:/tmp/novora.dump ./novora-$(date +%F).dump
```

`restart: unless-stopped` 已配置，服务器重启后容器会自动拉起。

完整的更新、备份、回滚流程见[更新与维护](/guide/local/06-maintenance)。

## 下一步

- 需要用域名或公网访问 → [反向代理与 HTTPS](/guide/local/04-reverse-proxy)
- 只需要内网访问 → [初始化与验收](/guide/local/05-acceptance)
