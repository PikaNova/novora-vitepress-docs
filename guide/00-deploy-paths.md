# 选择部署方式

Novora 官方支持两种部署方式。两者使用同一份源码、同一套功能，区别只在**网页与接口运行在哪里、数据库放在哪里、由谁负责维护**。开始之前请先选一条主线，之后按对应章节连续阅读即可。

## 两条主线怎么选

| 对比项 | Vercel 云端（默认推荐给新手） | 本地 / 内网 |
| --- | --- | --- |
| 网页与接口运行在 | Vercel Functions + Edge | 本机或局域网服务器（Docker 或 Node） |
| 数据库 | Neon 云端 PostgreSQL | 内嵌 PostgreSQL 16 或本机 PostgreSQL |
| 是否需要购买或长期开机一台服务器 | 不需要 | 需要 |
| 公网访问 | 默认支持，可绑定自定义域名 | 内网直接访问；公网需反向代理 + HTTPS |
| 中国大陆访问 | 境外节点，受运营商线路影响 | 局域网内稳定；公网质量取决于自建线路 |
| 起步成本 | 三家平台免费方案即可起步 | 一台可长期开机的电脑或服务器 |
| 谁能维护 | 会使用 GitHub、Vercel 控制台即可 | 需要能操作服务器、Docker 和备份 |
| 典型场景 | 多校统一管理、教室分散、无本地硬件 | 教室局域网、无外网、要求数据不出校内 |

## 推荐选择

**选 Vercel 云端**，如果：

- 没有可以 7×24 开机的服务器或机房；
- 需要老师和学生在家、在办公室也能访问；
- 希望平台自动完成构建、HTTPS 证书和版本回滚。

**选本地 / 内网**，如果：

- 学校要求数据保存在校内，不出校园网；
- 教室网络不能稳定访问境外服务；
- 已有可以长期开机的服务器、NAS 或机房主机。

两种方式可以同时存在：同一份源码，部署两套实例，互不影响。

## 两条主线的内容边界

两条主线里有一部分内容完全一样（管理员密码规则、恢复密钥保管、学校信息准备、初始化流程、验收标准），这部分放在「开始之前」三章，两边都要读。

其余内容各自独立：

| 主题 | Vercel 云端 | 本地 / 内网 |
| --- | --- | --- |
| 准备账号 | GitHub、Vercel、Neon | 只需一台服务器和局域网环境 |
| 获取源码 | Fork 作者仓库，交给 Vercel 构建 | 在服务器上 `git clone` |
| 数据库 | 创建 Neon 项目、复制 Pooled 连接串 | Docker 内嵌数据库，或自建 PostgreSQL |
| 环境变量 | `DATABASE_URL`、`ADMIN_PASSWORD`、`VERCEL_DEPLOY_HOOK_URL` | `ADMIN_PASSWORD`，无 Docker 时再加 `DATABASE_URL` |
| 部署方式 | Vercel 自动构建 | `docker compose up -d --build` 或 `npm run serve` |
| 访问地址 | `*.vercel.app` → 自定义域名 | `http://内网IP:3000` → 反向代理 + HTTPS |
| 更新方式 | Sync fork + Vercel 自动部署 | `update-local.sh` / `update-local.bat` |
| 备份方式 | Neon 分支或 `pg_dump` | Docker 卷备份或容器内 `pg_dump` |
| 查日志 | Vercel Functions Logs | `docker compose logs -f app` |

## 本教程不要求什么

按 Vercel 方向部署时不需要：自己买服务器、手工安装 PostgreSQL、执行建表 SQL、安装 Node.js、会写 React 或 TypeScript。

按本地方向部署时不需要：注册 Neon、注册 Vercel、会写 React 或 TypeScript；但需要会用命令行完成复制粘贴级别的操作（教程会给出完整命令）。

## 下一步

先读[项目介绍](/guide/01-introduction)了解 Novora 是什么，再读[部署原理](/guide/02-architecture)理解三层结构，然后进入[部署前准备](/guide/03-prerequisites)。

三章读完后，回到本章确认选择，再进入对应主线：

- [→ 进入 Vercel 云端部署主线](/guide/vercel/01-source-code)
- [→ 进入本地 / 内网部署主线](/guide/local/01-overview)
