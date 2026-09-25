# 3. 无 Docker 部署（Node + PostgreSQL）

本篇不依赖 Docker，直接用 Node.js 托管网页和接口，连接本机或内网的 PostgreSQL。适合已有 PostgreSQL、或需要频繁修改源码的场景。

::: tip 新手建议
如果只是想尽快用起来，直接选 [Docker Compose 部署](/guide/local/02-docker) 更省事：数据库、依赖、端口都在一套容器里，升级也不用管系统环境。
:::

## 前置要求

| 组件 | 版本要求 | 检查命令 |
| --- | --- | --- |
| Node.js | 24（项目声明 `24.x`） | `node --version` |
| npm | 随 Node 附带 | `npm --version` |
| PostgreSQL | 14 或更高 | `psql --version` |

## 第一步：准备数据库

用 `psql` 或任意数据库客户端创建库和账号：

```sql
CREATE ROLE novora WITH LOGIN PASSWORD '你的强密码';
CREATE DATABASE novora OWNER novora;
```

连接串格式：

```text
postgresql://novora:你的强密码@127.0.0.1:5432/novora
```

数据库在另一台内网机器时，把 `127.0.0.1` 换成那台机器的 IP，并在 `pg_hba.conf` 中放行对应网段。

## 第二步：拉取源码

```bash
sudo mkdir -p /opt/novora
cd /opt/novora
sudo git clone https://github.com/你的用户名/Novora.git .
```

## 第三步：配置环境变量

```bash
cp .env.example .env
nano .env
```

关键项：

```text
DATABASE_URL=postgresql://novora:你的强密码@127.0.0.1:5432/novora
ADMIN_PASSWORD=你的强密码
PORT=3000
```

无 Docker 部署不会自动注入数据库地址，**必须**填写 `DATABASE_URL`。

## 第四步：安装依赖并启动

```bash
npm install
npm run serve
```

`npm run serve` 会先构建前端与 `server/`，再启动单个 Node 进程托管静态站点和全部 API。看到监听端口输出后即可访问。

## 第五步：访问

```text
http://localhost:3000           # 本机
http://服务器局域网IP:3000       # 局域网其他设备
```

防火墙需要放行 `3000` 端口。

## 让服务长期运行

`npm run serve` 在前台运行，关闭终端就停止。生产环境建议用 systemd 或 pm2 托管：

```ini
# /etc/systemd/system/novora.service
[Unit]
Description=Novora
After=network.target postgresql.service

[Service]
Type=simple
WorkingDirectory=/opt/novora
EnvironmentFile=/opt/novora/.env
ExecStart=/usr/bin/npm run serve
Restart=always
RestartSec=5
User=novora

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now novora
sudo systemctl status novora
```

## 常用维护命令

```bash
# 查看服务状态（systemd 方式）
sudo systemctl status novora

# 查看日志
sudo journalctl -u novora -f

# 更新到最新代码
cd /opt/novora
git pull
npm install
npm run build
sudo systemctl restart novora
```

详见[更新与维护](/guide/local/06-maintenance)。

## 下一步

- 需要用域名或公网访问 → [反向代理与 HTTPS](/guide/local/04-reverse-proxy)
- 只需要内网访问 → [初始化与验收](/guide/local/05-acceptance)
