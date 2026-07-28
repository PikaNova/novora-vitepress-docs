# 7. 配置环境变量

环境变量是在 Vercel 中保存的部署配置。敏感值不会出现在浏览器源码中，也不应写入 GitHub。

从自己的 Fork 创建 Vercel 项目时，首次必须填写 `DATABASE_URL` 和 `ADMIN_PASSWORD`。项目创建后还必须生成 Deploy Hook，并补充 `VERCEL_DEPLOY_HOOK_URL`。

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

::: warning 为什么不能在首次创建项目时填写
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

### 第一步：确认生产分支

1. 打开 Vercel 项目 **Settings → Git**。
2. 在 Connected Git Repository 中确认连接的是实际部署 Novora 的仓库。
3. 确认 Production Branch，通常为 `main`。

Hook 只会重新构建这里连接的 Fork 和所选分支。它不会自动把作者仓库的新提交同步到你的 Fork。

### 第二步：生成 Hook URL

1. 继续在 **Settings → Git** 页面向下找到 **Deploy Hooks**。
2. 在 Hook 名称中填写 `Novora Production Update`。
3. Branch 选择上一步确认的 `main`，不要选择临时开发分支。
4. 点击 **Create Hook**。
5. 创建成功后复制以 `https://api.vercel.com/v1/integrations/deploy/` 开头的完整 URL。

Vercel 控制台改版后，入口名称可能显示为 **Deploy Hooks** 或位于 Git 设置的同名区域，但填写原则不变：名称用于自己识别，Branch 必须是生产分支，最终需要复制完整 URL。

::: danger 不要在浏览器中测试打开 Hook URL
访问或请求该 URL 就可能触发生产部署。不要把它发到群聊、GitHub Issue、截图或客户端源码中。
:::

### 第三步：填写环境变量

1. 打开项目 **Settings → Environment Variables**。
2. 点击 **Add New**。
3. Key 或 Name 完整填写 `VERCEL_DEPLOY_HOOK_URL`，注意全部大写。
4. Value 粘贴刚才复制的完整 Hook URL，不加引号，不留首尾空格。
5. Environment 至少勾选 **Production**。
6. 点击 **Save**。

Deploy Hook 是生产项目自身的更新入口。Preview 若确实需要独立更新，应创建指向测试分支的另一条 Hook，不要让测试环境共用生产 Hook。

### 第四步：让变量生效

1. 打开 **Deployments**。
2. 找到当前最新的 Production Deployment。
3. 打开右侧菜单，选择 **Redeploy**。
4. 确认使用当前项目设置重新构建。
5. 等待状态变为 **Ready**。

环境变量只对新 Deployment 生效。只保存变量而不重新部署，旧 Functions 仍然读取不到钩子。

### 第五步：在 Novora 中验证

1. 使用超级管理员登录 Novora。
2. 打开 **系统设置 → 版本与更新**。
3. 确认没有“缺少 `VERCEL_DEPLOY_HOOK_URL`”警告。
4. 确认页面出现 **一键部署更新**。
5. 在没有考试的维护窗口点击一次。
6. 立即回到 Vercel **Deployments**，确认出现新的部署记录并最终变为 **Ready**。
7. 返回 Novora 检查首页、登录和数据读取。

Deploy Hook 会重新拉取当前 Vercel 项目连接仓库的 `main` 分支并构建。它不会自动把官方 Novora 的新提交合并到另一个未同步的 Fork；使用 Fork 时应先在 GitHub 完成 Sync fork。

测试 Hook 只需要确认 Vercel 出现一条新的部署记录。不要连续点击：一次成功请求就会创建一次构建任务。若 GitHub 在同步 `main` 后已经自动触发部署，可以直接等待该部署完成，无需再点一键部署。

## Deploy Hook 维护与轮换

出现泄露、误触发或需要更换分支时：

1. 在 **Settings → Git → Deploy Hooks** 删除旧 Hook；
2. 创建指向正确生产分支的新 Hook；
3. 用新 URL 覆盖 `VERCEL_DEPLOY_HOOK_URL`；
4. 重新部署使新值生效；
5. 在 Novora 中执行一次维护窗口测试。

若按钮不出现，依次检查：变量名是否拼写正确、是否勾选 Production、添加变量后是否 Redeploy、当前账号是否有 `deployment.trigger` 权限。若点击后提示 `NO_HOOK`，说明当前运行中的 Functions 仍未读到变量；若 Vercel 返回非 2xx 状态，优先检查 Hook 是否被删除、分支是否仍存在，以及 URL 是否粘贴完整。

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
