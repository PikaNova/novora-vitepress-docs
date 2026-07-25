# 附录 E：本地部署

本章介绍如何在一台 Windows 电脑上运行完整 Novora，并让同一局域网中的其他设备访问。它适合校内测试、演示和开发验收。

::: warning 使用范围
Novora 当前原生部署目标是 Vercel Functions。本教程使用 Vercel CLI 在本机模拟网页和 Functions，数据库仍使用 Neon，因此不是完全离线部署，也不建议未经改造直接作为 7×24 小时生产服务器。
:::

## 本地部署结构

```text
同一局域网中的浏览器
        │
        ▼
Windows 电脑：http://电脑局域网IP:3000
        │
        ▼
Vercel CLI：网页 + /api Functions
        │
        ▼
Neon 新加坡数据库
```

运行 Novora 的电脑和访问设备都必须能连接 Neon。断开互联网后，已有浏览器缓存可能还能显示部分内容，但登录、保存和云端同步不可用。

## 1. 准备电脑

推荐配置：

- Windows 10 或 Windows 11；
- 4 GB 以上内存；
- 稳定的有线网络；
- Node.js 20 LTS；
- Git；
- 可正常访问 Neon 的互联网连接。

电脑休眠、关机或关闭命令窗口后，其他设备将无法访问。

## 2. 安装 Node.js 和 Git

从官方渠道安装 Node.js 20 LTS 和 Git。安装完成后打开新的 PowerShell，执行：

```powershell
node --version
npm --version
git --version
```

三个命令都能显示版本号才继续。如果提示“不是内部或外部命令”，关闭 PowerShell 重新打开；仍失败时检查安装程序是否添加了 PATH。

## 3. 获取源码

选择一个专门存放项目的目录，在 PowerShell 中执行：

```powershell
git clone https://github.com/你的用户名/Novora.git
cd Novora
```

如果使用 ZIP：

1. 解压到固定目录；
2. 打开解压目录；
3. 确认当前目录直接包含 `package.json`、`api`、`src` 和 `vercel.json`；
4. 在该目录打开 PowerShell。

不要在压缩包内部直接运行。

## 4. 安装项目依赖

```powershell
npm install
```

首次安装需要联网，耗时取决于网络。完成后目录中会出现 `node_modules`。

安装失败时不要从不明网站下载别人打包的 `node_modules`。记录错误，检查 npm 网络、Node.js 版本和磁盘权限后重试。

## 5. 准备本地专用 Neon 数据库

按照[创建 Neon 数据库](/guide/05-neon)再创建一套测试数据库。不要直接连接生产数据库。

推荐名称：

```text
novora-local-test
```

选择 AWS Singapore，并复制 Pooled connection string。

## 6. 创建本地环境变量

在项目根目录新建 `.env.local`：

```dotenv
DATABASE_URL=粘贴本地测试数据库的完整Pooled连接串
ADMIN_PASSWORD=填写至少12位的本地测试管理员密码
```

注意：

- 等号两侧不要加空格；
- 值通常不需要引号；
- 每个变量单独一行；
- 不要提交 `.env.local` 到 GitHub；
- 不要使用生产管理员密码。

可按需继续添加 `GITHUB_REPO` 等可选变量，但首次本地运行只需要上面两项。

## 7. 安装并登录 Vercel CLI

```powershell
npm install --global vercel
vercel login
```

按终端提示在浏览器完成登录。然后在项目根目录执行：

```powershell
vercel link
```

如果已经有对应的 Vercel 项目，选择链接现有项目。如果只做本地测试，也可以按提示创建测试项目，但不要把本地测试数据库变量覆盖到生产环境。

::: tip 不想全局安装
也可以把下面命令中的 `vercel` 改为 `npx vercel`。第一次运行会下载 CLI，因此仍需要联网。
:::

## 8. 启动完整本地服务

在项目根目录执行：

```powershell
vercel dev --listen 0.0.0.0:3000
```

如果使用 npx：

```powershell
npx vercel dev --listen 0.0.0.0:3000
```

看到服务已监听 3000 端口后，在本机打开：

```text
http://localhost:3000
```

再测试：

```text
http://localhost:3000/api/time
```

首页和 API 都正常，说明完整本地服务已启动。

## 9. 完成本地初始化

1. 打开 `http://localhost:3000`；
2. 等待首页确认云端没有学校结构；
3. 点击“开始初始化”；
4. 使用 `admin` 和 `.env.local` 中的 `ADMIN_PASSWORD` 登录；
5. 创建测试学校、年级和班级；
6. 返回首页选择当前设备班级；
7. 创建测试考试并刷新确认数据仍存在。

这些数据保存在本地测试 Neon，而不是电脑硬盘中的数据库文件。

## 10. 允许局域网访问

第一次监听 `0.0.0.0` 时，Windows 防火墙可能弹出提示。只勾选可信的**专用网络**，不要在公共网络中开放。

查看本机局域网 IPv4 地址：

```powershell
ipconfig
```

找到正在使用的网卡，例如：

```text
IPv4 地址 . . . . . . . . . . . . : 192.168.1.50
```

同一局域网设备访问：

```text
http://192.168.1.50:3000
```

如果本机能访问、其他设备不能访问，检查：

- 两台设备是否在同一个局域网；
- 无线网络是否启用了客户端隔离；
- Windows 网络是否设为“专用”；
- 防火墙是否允许 Node.js 或 3000 端口；
- IP 地址是否因 DHCP 发生变化。

## 11. HTTP 的限制

除 `localhost` 外，局域网 `http://192.168.x.x:3000` 不属于安全上下文。浏览器可能限制：

- PWA 安装；
- Service Worker；
- 部分剪贴板和系统权限；
- 某些未来新增的安全 API。

因此局域网 HTTP 适合功能测试，不等同于正式 HTTPS 部署。若需要校内长期 HTTPS，应配置固定域名、证书、反向代理和可靠的进程管理，并进行专门的生产改造与安全评审。

## 12. 停止和再次启动

在运行窗口按 `Ctrl + C` 停止服务。

下次启动：

1. 打开 PowerShell；
2. 进入项目根目录；
3. 再次执行 `vercel dev --listen 0.0.0.0:3000`；
4. 保持窗口运行。

不要依赖开发命令自动随 Windows 启动。需要常驻服务时，应先完成适合 Node 服务的生产化改造，而不是简单把 PowerShell 放进启动文件夹。

## 13. 本地更新

Git 仓库没有本地改动时：

```powershell
git pull
npm install
npm run build
vercel dev --listen 0.0.0.0:3000
```

更新前备份测试数据库。存在本地代码修改时先提交或建立分支，不要使用会覆盖文件的强制命令。

## 14. 本地部署验收

- [ ] 本机首页可访问
- [ ] 本机 `/api/time` 返回 JSON
- [ ] `admin` 可登录并完成初始化
- [ ] 测试数据刷新后仍存在
- [ ] 同一局域网另一台设备可打开首页
- [ ] Windows 防火墙只对可信专用网络开放
- [ ] 使用独立测试 Neon，不连接生产库
- [ ] 明确知道关闭终端或电脑后服务会停止

## 完全离线部署说明

当前代码使用 `@neondatabase/serverless` 和 Vercel Functions，不能仅把 `DATABASE_URL` 改成本机 PostgreSQL 就宣称完成离线部署。完全离线或校内服务器生产部署至少需要：

- 为 API 增加长期运行的 Node 服务入口；
- 评估并替换数据库连接适配器；
- 部署和迁移本地 PostgreSQL；
- 配置反向代理、HTTPS、日志轮转和进程守护；
- 制定备份、恢复、升级和安全补丁流程；
- 重新执行权限、并发和断网测试。

这属于代码和架构改造，不在当前“零修改本地运行”范围内。
