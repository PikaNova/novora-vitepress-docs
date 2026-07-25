# 附录 D：作者遥测后台

作者遥测后台是独立的中央收集器和数据看板，不是 Novora 主站的必需组件。只有项目作者或需要集中管理多套部署实例的组织才需要部署。

::: danger 必须独立部署
遥测后台应使用独立 GitHub 仓库、独立 Vercel 项目和独立 Neon 数据库。不要把遥测表与学校的 Novora 业务库混在一起。
:::

## 收集什么

启用遥测的 Novora 实例会报告：

- 匿名实例 ID；
- deploy、boot、heartbeat 等事件类型；
- 应用版本与 commit；
- 运行环境、域名、时区、语言和 User-Agent；
- IP 摘要而非明文 IP；
- 用户同意后报告省份和完整校名；
- 周测启用状态等聚合运行信息。

不应收集班级名称、考试正文、管理员密码或登录会话。

## 技术组成

| 组件 | 技术 |
| --- | --- |
| 前端看板 | React、Vite、TypeScript |
| 后端 | Vercel Serverless Functions |
| 数据库 | 独立 Neon PostgreSQL |

后台提供实例概览、版本分布、地区分布、事件、性能、更新进度、公告和数据导入导出等功能。

## 创建独立 Neon

按照主文档的 Neon 步骤再创建一个项目，例如：

```text
novora-telemetry
```

选择 AWS Singapore，并复制该项目自己的 Pooled connection string。绝对不要复用 Novora 业务库的 `DATABASE_URL`。

## 部署独立 Vercel 项目

1. 将遥测后台源码放入独立 GitHub 仓库。
2. 在 Vercel 新建项目并导入该仓库。
3. Framework Preset 选择 Vite。
4. Build Command 使用 `npm run build`。
5. Output Directory 使用 `dist`。
6. 配置下列环境变量后部署。

## 必填环境变量

| 变量 | 说明 |
| --- | --- |
| `DATABASE_URL` | 遥测专用 Neon Pooled 连接串 |
| `AUTHOR_PASSWORD` | 进入作者看板的密码 |
| `TOKEN_SECRET` | 登录 Token 的随机签名密钥 |
| `TELEMETRY_INGEST_KEY` | 客户端上报时使用的共享采集密钥 |

`TOKEN_SECRET` 和 `TELEMETRY_INGEST_KEY` 应分别生成，使用足够长的随机值，不能与管理员密码相同。

## 可选环境变量

| 变量 | 说明 |
| --- | --- |
| `GITHUB_TOKEN` | 提高 GitHub API 限额，私有仓库时需要 |
| `GITHUB_REPO` | 遥测后台自身更新检查仓库 |
| `CLIENT_GITHUB_REPO` | 旧客户端更新进度仓库 |
| `V2_CLIENT_GITHUB_REPO` | Novora V2 仓库，格式为 `owner/repo` |
| `VERCEL_DEPLOY_HOOK_URL` | 遥测后台自身重新部署 Hook |

V2 上线后应配置 `V2_CLIENT_GITHUB_REPO`，否则后台不会统计 V2 更新进度，也不应默默回退到旧仓库。

## 连接 Novora 客户端

如果要让某套 Novora 上报到自建后台，需要在该 Novora Vercel 项目中配置相应的遥测覆盖变量：

```text
TELEMETRY_BASE_URL=https://你的遥测域名
TELEMETRY_INGEST_KEY=与后台完全一致的采集密钥
```

仅在接口路径不是默认规则时，再设置 `TELEMETRY_COLLECT_URL` 或 `TELEMETRY_ANNOUNCE_URL`。修改后重新部署 Novora。

不要把采集密钥写入前端可见代码、公开仓库或文档示例。

## 登录和验收

部署完成后：

1. 打开遥测后台自定义域名；
2. 使用 `AUTHOR_PASSWORD` 登录；
3. 确认数据库表自动建立；
4. 使用一个测试 Novora 实例明确同意遥测；
5. 等待 deploy、boot 或 heartbeat；
6. 检查看板是否出现实例；
7. 确认没有采集考试正文和敏感认证信息。

## 数据导入导出

遥测后台支持导出实例、事件、公告和公告图片。数据量较大时会分页或分批传输，以避开 Vercel 单次请求/响应体限制。

导出的 JSON 可能包含学校、域名、设备特征和运行事件，应视为敏感运营数据。迁移后验证去重、事件数量、公告图片和发布时间。

## 运维建议

- 与主站分别设置备份和权限；
- 定期轮换作者密码、Token 密钥和采集密钥；
- 轮换采集密钥时同步更新所有客户端；
- 限制作者后台域名的传播范围；
- 定期清理不再需要的原始事件；
- 根据学校和适用法规确定保留周期与告知方式；
- 公告图片和导出文件纳入容量监控。

普通学校仅部署一套 Novora 时，可以完全跳过本附录。
