# 8. 执行首次部署

本章完成第一次构建，并在初始化前绑定自定义域名。中国大陆用户不应把 `*.vercel.app` 作为唯一正式入口。

## 开始构建

在 Vercel Configure Project 页面确认环境变量后，点击 **Deploy**。Vercel 会依次执行安装依赖、运行 `npm run build`、发布静态文件和创建 Functions。

正常构建日志中应看到 Vite build 完成，并最终显示部署成功。首次构建通常需要数分钟。

## 构建成功但默认地址打不开

中国大陆网络可能无法访问 Vercel 分配的：

```text
https://项目名.vercel.app
```

这不一定说明构建失败。先在 Vercel Dashboard 中确认 Deployment 状态为 **Ready**，然后继续绑定自定义域名。

## 添加子域名（推荐）

假设已有域名 `example.com`，推荐给 Novora 使用：

```text
exam.example.com
```

操作步骤：

1. 打开 Vercel 项目。
2. 进入 **Settings → Domains**。
3. 输入 `exam.example.com`。
4. 点击 **Add**。
5. 保留该页面，查看 Vercel 要求的 DNS 记录。

## 在域名服务商添加 DNS

进入域名服务商的“DNS 解析”或“域名解析”页面。子域名通常使用：

| 项目 | 常见填写值 |
| --- | --- |
| 记录类型 | `CNAME` |
| 主机记录 | `exam` |
| 记录值 | Vercel 页面显示的 CNAME 目标，常见为 `cname.vercel-dns.com` |
| TTL | 自动或默认 |

::: warning 以 Vercel 当前页面为准
Vercel 可能为账号或项目显示不同的目标值。教程中的 `cname.vercel-dns.com` 只是常见示例，必须优先填写 Vercel Domains 页面实际给出的记录。
:::

同一主机名不能同时保留冲突的 A、AAAA 和 CNAME 记录。若 `exam` 已有旧解析，应先确认旧服务不再使用，再调整记录。

## 使用根域名（可选）

如果希望直接访问 `example.com`，在 Vercel 添加根域名后，按 Vercel 页面要求添加 A 记录。常见示例是：

| 项目 | 常见填写值 |
| --- | --- |
| 记录类型 | `A` |
| 主机记录 | `@` |
| 记录值 | `76.76.21.21` |
| TTL | 自动或默认 |

同样应以 Vercel 当前提供的记录为准。建议另加 `www` 子域名，并在 Vercel 中选定一个 Primary Domain，让另一个跳转到主域名。

## 等待 DNS 和 HTTPS

返回 Vercel 的 Domains 页面查看状态：

| 状态 | 含义 |
| --- | --- |
| Valid Configuration | DNS 正确，域名已连接 |
| Pending | DNS 仍在传播或等待验证 |
| Invalid Configuration | 记录类型、主机名或目标值错误 |

DNS 通常在数分钟至数小时内生效，极端情况下可能需要 24 至 48 小时。验证成功后，Vercel 会自动申请 HTTPS 证书，无需购买或上传证书。

## 初步访问测试

打开：

```text
https://exam.example.com
```

不要使用 `http://`。浏览器地址栏应显示 HTTPS 正常，页面应出现 Novora 首页。

再测试以下地址：

```text
https://exam.example.com/api/time
```

正常情况下会返回 JSON，而不是 Vercel 404 页面。具体字段可能随版本调整，只要得到有效 JSON 且 HTTP 状态正常即可。

## 大陆访问边界

自定义域名不等于大陆 CDN，也不会改变 Vercel 实际节点位置。正式使用前：

1. 使用学校网络访问首页和 `/api/time`；
2. 使用至少一种手机网络再次测试；
3. 在上课时段测试登录、保存和同步延迟；
4. 若多运营商持续不可用，评估香港、新加坡其他托管方案，或使用已备案的中国大陆服务器和合规 CDN。

普通国际版 Cloudflare 也不能保证中国大陆线路质量，不应把“开启代理”写成必然有效的解决方案。

## 完成标志

- [ ] Vercel Deployment 状态为 Ready
- [ ] 自定义域名显示 Valid Configuration
- [ ] HTTPS 证书正常
- [ ] 学校网络可以打开首页
- [ ] `/api/time` 返回有效响应

[下一章：首次登录和初始化 →](/guide/09-initialization)
