# 附录 A：常见问题与故障排查

排查时先记录发生时间、操作步骤、页面错误、HTTP 状态和请求 ID。一次只修改一个配置，修改后重新部署并复测，避免无法判断哪个改动生效。

## 快速定位表

| 现象 | 优先检查 |
| --- | --- |
| Vercel 构建失败 | Build Logs、Root Directory、Node 依赖 |
| 首页完全打不开 | 域名 DNS、Vercel Deployment 状态、学校网络 |
| 首页白屏但有 HTML | JS/CSS 请求、`ASSET_CDN_BASE`、浏览器控制台 |
| `/api/time` 404 | `vercel.json`、Root Directory、API 是否被识别 |
| 登录提示无法连接 | `DATABASE_URL`、Neon 状态、Functions 日志 |
| `admin` 密码错误 | `ADMIN_PASSWORD`、是否已有管理员、是否用错数据库 |
| 首页一直“正在同步” | `/api/exams`、网络、数据库初始化错误 |
| 刷新 `/admin` 404 | SPA rewrite、是否部署了正确项目根目录 |
| 自定义域名 Pending | DNS 记录和传播时间 |
| PDF 字体或版面异常 | 字体资源、浏览器、数据量、版本 |

## 1. Vercel 构建失败

打开 **Deployments → 失败的部署 → Build Logs**，从第一条真正的 error 开始看，不要只看最后的 `Command exited`。

检查项目设置：

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Root Directory: package.json 所在目录
```

常见原因包括源码没有完整上传、`package.json` 不在 Root Directory、依赖锁文件冲突或 TypeScript 构建错误。

## 2. 自定义域名无法访问

先看 Vercel **Settings → Domains**：

- `Invalid Configuration`：按照 Vercel 当前给出的记录修正 DNS；
- `Pending`：等待传播并检查是否有冲突记录；
- `Valid Configuration`：继续检查学校网络、HTTPS 和部署状态。

子域名 CNAME 的主机记录通常只填 `exam`，而不是再次填写完整 `exam.example.com`。不同 DNS 服务商规则可能不同，以服务商界面提示为准。

在一个网络能打开、另一个网络打不开，通常属于 DNS 缓存、运营商线路或境外服务可达性问题，不是 React 页面代码本身。

## 3. HTTPS 证书未生效

Vercel 只有在域名正确指向项目后才能自动签发证书。检查：

- DNS 是否已显示 Valid Configuration；
- CAA 记录是否限制了证书签发机构；
- 是否刚修改域名仍在传播；
- 浏览器是否缓存了旧证书或旧跳转。

不要自行把来历不明的证书文件提交到仓库。

## 4. 首页白屏或没有样式

按 `F12` 打开开发者工具，查看 Console 和 Network：

- JS/CSS 404：检查是否错误设置 `ASSET_CDN_BASE`；
- `Unexpected token <`：资源地址返回了 HTML，检查重写和 CDN；
- 字体 404：检查 `/fonts/*` 是否存在；
- Chunk 加载失败：强制刷新或清理旧 Service Worker 缓存。

普通部署应让 `ASSET_CDN_BASE` 留空。删除或修正环境变量后必须重新部署。

## 5. `/api/time` 或其他 API 返回 404

确认部署根目录内存在：

```text
api/time.ts
api/login.ts
api/exams.ts
vercel.json
```

如果 Vercel 只部署了 `dist` 静态文件而没有识别 `api` 目录，通常是 Root Directory 选错或上传的是仅含构建产物的压缩包。

## 6. 数据库连接失败

检查 Vercel 中的 `DATABASE_URL`：

- 是否为当前 Neon 项目；
- 是否完整包含协议、用户名、密码、主机、数据库和 SSL 参数；
- 是否复制了 Pooled 连接串；
- 是否有额外引号、空格或换行；
- 环境变量是否应用到 Production；
- 修改后是否重新部署。

再打开 Neon Console，确认项目和分支正常，没有达到平台额度或暂停状态。

## 7. 首次 `admin` 登录失败

全新数据库第一次登录时，用户名为：

```text
admin
```

密码为部署时的 `ADMIN_PASSWORD`。注意：

- 密码区分大小写；
- 如果数据库已经创建过管理员，应使用数据库中现有密码；
- 修改 Vercel 的 `ADMIN_PASSWORD` 不会覆盖已有账号；
- 换到另一套 Neon 数据库后，会重新进入首次创建逻辑。

不要为了找回密码直接删除生产数据库。先确认是不是连错 Neon 项目，并查看账号管理和备份方案。

V2.5.4 的分级找回规则为：班级管理员联系所属年级管理员或超级管理员，年级管理员联系超级管理员。所有超级管理员密码均遗忘时，确认 Vercel 已配置至少 16 位的 `ADMIN_RECOVERY_KEY`，再使用登录页的超级管理员恢复入口。恢复后立即轮换密钥并重新部署。

## 8. 首页没有“开始初始化”

首页只有在成功读取云端并确认没有年级、班级时才显示初始化入口。

- 显示“正在同步”：等待完成；
- 显示“暂时无法读取”：点击重新同步并检查 API；
- 已有年级班级：系统不会允许重复初始化；
- 已登录且确定云端为空：可使用后台“首次初始化”入口。

备用地址：

```text
/login?mode=initialize&next=/admin%3Finitialize%3D1
```

备用地址不会绕过服务端对已有学校结构的保护。

## 9. 保存时报 401 或 403

| 状态 | 常见含义 |
| --- | --- |
| 401 | 登录会话过期或令牌无效 |
| 403 `PASSWORD_CHANGE_REQUIRED` | 必须先修改初始密码 |
| 403 `PERMISSION_DENIED` | 当前角色没有该操作权限或数据范围 |

401 时重新登录。403 时不要反复重试，先由超级管理员检查角色权限和年级、班级授权范围。

## 10. 如何使用请求 ID 查日志

1. 保留页面显示的请求 ID。
2. 记录本地时间和执行的操作。
3. 打开 Vercel 项目的 Logs。
4. 搜索请求 ID。
5. 展开对应 Function 请求。
6. 判断错误来自数据库、认证、GitHub API 还是外部遥测服务。

向他人求助时可以提供请求 ID、时间、Novora 版本和已脱敏错误，但不要提供连接串、密码、Token 或完整请求头。

## 11. PDF 下载失败

先确认网页预览中已有有效班级和考试安排。然后检查：

- 浏览器是否阻止下载；
- 字体请求是否成功；
- 设备内存是否足够；
- 是否使用过旧缓存；
- 数据是否过多导致生成时间较长。

分别在最新版 Chrome/Edge 和另一台设备测试。保留能复现问题的数据数量与浏览器版本。

## 12. 更新后仍显示旧版本

1. 确认 GitHub 生产分支已有新提交；
2. 确认 Vercel 新部署为 Ready；
3. 确认主域名指向最新生产部署；
4. 强制刷新页面；
5. 关闭并重新打开 PWA；
6. 等待 Service Worker 更新提示；
7. 必要时清除站点缓存后重试。

清除站点数据可能移除当前设备班级和显示偏好，操作前记录本机绑定情况。

## 仍无法解决

整理以下信息：

```text
Novora 版本：
发生时间和时区：
访问域名：可脱敏
操作步骤：
实际结果：
预期结果：
HTTP 状态：
请求 ID：
浏览器与系统：
学校网络/移动网络：
```

删除所有密码、Token、Cookie 和数据库连接串后再提交问题。
