# 7. 配置环境变量

环境变量是在 Vercel 中保存的部署配置。敏感值不会出现在浏览器源码中，也不应写入 GitHub。

使用 README 的一键部署按钮时，Vercel 首次要求填写 `DATABASE_URL` 和 `ADMIN_PASSWORD`。项目创建后还必须生成 Deploy Hook，并补充 `VERCEL_DEPLOY_HOOK_URL`。

## 必填变量

### DATABASE_URL

| 项目 | 内容 |
| --- | --- |
| Name | `DATABASE_URL` |
| Value | Neon 的完整 Pooled connection string |
| Environment | Production，建议同时选择 Preview 和 Development |

复制时不要增加引号、空格或换行。必须保留连接串末尾的 SSL 参数。

### ADMIN_PASSWORD

| 项目 | 内容 |
| --- | --- |
| Name | `ADMIN_PASSWORD` |
| Value | 前面准备的独立强密码 |
| Environment | Production，建议同时选择 Preview 和 Development |

至少 8 位，建议 12 位以上。首次使用 `admin` 登录时，服务端会验证它并创建初始超级管理员。

::: warning 后续修改此变量不会直接修改现有账号密码
初始管理员创建后，密码以加盐哈希保存在 Neon。重新部署或修改 `ADMIN_PASSWORD` 不会覆盖数据库中已有的管理员密码。日常改密应在“用户与权限”中完成。
:::

### VERCEL_DEPLOY_HOOK_URL

| 项目 | 内容 |
| --- | --- |
| Name | `VERCEL_DEPLOY_HOOK_URL` |
| Value | Vercel 为当前项目 `main` 分支生成的完整 Deploy Hook URL |
| Environment | Production |

该钩子用于后台“版本与更新 → 一键部署更新”。Hook URL 能触发生产部署，应像密码一样保管，不能写入 GitHub 或公开截图。

::: warning 为什么不能在一键部署第一屏填写
Deploy Hook 只有 Vercel 项目创建后才能生成。第一次 Deploy 是创建项目的引导步骤；生成钩子、添加变量并 Redeploy 后，正式配置才完整。
:::

## 推荐的可选变量

| 变量 | 何时填写 | 示例或说明 |
| --- | --- | --- |
| `GITHUB_REPO` | 使用自己的更新仓库时 | `owner/Novora` 或完整 GitHub 仓库地址 |
| `GITHUB_TOKEN` | 私有仓库或 GitHub API 限额不足时 | GitHub 访问令牌，按最小权限创建 |
| `ASSET_CDN_BASE` | 已正确配置独立静态资源 CDN 时 | 如 `https://cdn.example.com/`；普通部署留空 |

`ASSET_CDN_BASE` 配错会导致 JS 或 CSS 无法加载，零基础部署不要填写。

## 遥测覆盖变量

项目内置了作者维护的遥测连接配置。只有需要覆盖默认作者端地址或自建遥测后台时，才考虑以下变量：

| 变量 | 用途 |
| --- | --- |
| `TELEMETRY_BASE_URL` | 自定义遥测后台基础地址 |
| `TELEMETRY_COLLECT_URL` | 自定义数据收集完整地址 |
| `TELEMETRY_ANNOUNCE_URL` | 自定义公告接口完整地址 |
| `TELEMETRY_INGEST_KEY` | 与自建遥测后台一致的采集密钥 |
| `TELEMETRY_IP_SALT` | 遥测 IP 摘要盐值 |

不部署自有遥测后台时不要随意填写。系统内可查看遥测说明和同意状态；遥测开启后会上传实例版本、运行环境、匿名实例标识、省份和完整校名，不上传考试正文、管理员密码或登录会话。

## 创建 Deploy Hook（正式部署必做）

1. 打开 Vercel 项目 **Settings → Git**。
2. 找到 **Deploy Hooks**。
3. Hook 名称填写 `Novora Update`。
4. Branch 选择生产分支，通常是 `main`。
5. 创建后复制完整 Hook URL，不要只复制名称。
6. 打开 **Settings → Environment Variables**，新建 `VERCEL_DEPLOY_HOOK_URL`。
7. Value 粘贴 Hook URL，勾选 **Production** 并保存。
8. 回到 **Deployments**，对最新生产部署执行 **Redeploy**。
9. 重新登录 Novora，进入“系统设置 → 版本与更新”，确认出现 **一键部署更新**。

Deploy Hook 会重新拉取当前 Vercel 项目连接仓库的 `main` 分支并构建。它不会自动把官方 Novora 的新提交合并到另一个未同步的 Fork；使用 Fork 时应先在 GitHub 完成 Sync fork。

## 环境选择

Vercel 通常提供三类环境：

- **Production**：正式域名使用的部署；
- **Preview**：非生产分支或 Pull Request 的预览；
- **Development**：Vercel 本地开发环境。

零基础部署可以为必填变量勾选三者，确保预览和生产行为一致。若 Preview 与 Production 必须使用不同数据库，应分别配置不同值，避免测试数据写进生产库。

## 修改后必须重新部署

环境变量只对新部署生效。修改变量后：

1. 进入 **Deployments**。
2. 找到最新生产部署。
3. 打开右侧菜单并选择 **Redeploy**。
4. 确认使用当前项目设置重新构建。

如果部署后修改任何一个环境变量，仍需重新部署，新值才会被 Functions 读取。

## 检查清单

- [ ] `DATABASE_URL` 使用 Neon Pooled 连接串
- [ ] `ADMIN_PASSWORD` 至少 8 位且没有泄露
- [ ] 已创建指向 `main` 的 Deploy Hook，并填写 `VERCEL_DEPLOY_HOOK_URL`
- [ ] 变量名完全使用大写和下划线
- [ ] Value 没有额外引号或换行
- [ ] Production 环境已勾选
- [ ] 可选变量只在明确需要时填写

[下一章：执行首次部署和绑定域名 →](/guide/08-first-deploy)
