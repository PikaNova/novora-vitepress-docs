# F. 将 Vercel Functions 迁移到新加坡

Novora 的 Functions 需要频繁访问 Neon。Neon 使用 AWS Singapore 时，Functions 也放在新加坡 `sin1`，可以避免每次 API 请求跨洲访问数据库。

## 迁移前确认

1. Neon 项目 Region 是 AWS Singapore / `ap-southeast-1`。
2. GitHub 仓库根目录存在 `vercel.json`。
3. 你拥有 Vercel 项目的设置权限。
4. 当前业务数据已经备份。

区域迁移不会自动搬迁 Neon 数据库，也不会改变自定义域名。

## 方法一：使用仓库配置（推荐）

确认 `vercel.json` 包含：

```json
{
  "regions": ["sin1"]
}
```

提交并推送后创建新部署。Vercel 会让新的 Serverless Functions 在 `sin1` 运行。仓库配置可随源码版本保留，适合长期维护。

## 方法二：在 Vercel 控制台设置

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)。
2. 打开 Novora 项目。
3. 进入 **Settings → Functions**。
4. 找到 **Function Region**。
5. 展开 **Asia Pacific**。
6. 选择 **Singapore (`sin1`)**。
7. 点击右下角 **Save**。
8. 回到 **Deployments**，对最新生产版本执行 **Redeploy**。

::: warning 保存后必须重新部署
区域设置只影响新 Deployment。页面提示 “A new Deployment is required for your changes to take effect” 时，说明旧函数仍在原区域运行。
:::

Hobby 套餐通常只能选择一个函数区域。Novora 不需要同时选择多个区域。

## 验证是否生效

1. 打开 Vercel 项目的 **Logs**。
2. 在 Novora 中执行一次登录或刷新考试数据。
3. 打开对应 `/api/login` 或 `/api/exams` 请求。
4. 确认 Region 显示 `sin1`。
5. 确认请求返回 `200`，登录凭据错误时 `/api/login` 返回 `401` 也说明函数已经执行。

还应实际测试：

- 首页加载班级数据；
- 管理后台登录；
- 创建并保存一条测试安排；
- 学校网络和手机移动网络访问自定义域名。

## 常见问题

### 控制台显示 Overridden

这通常表示仓库 `vercel.json` 已覆盖控制台默认值。只要代码中的区域是 `sin1`，属于正常状态。不要同时保留冲突配置。

### 日志仍显示 `iad1`

先确认查看的是修改后的新 Deployment，而不是历史日志。再检查生产分支是否包含最新 `vercel.json`，最后重新执行 Redeploy。

### 迁移后仍然很慢

检查 Neon 是否也在新加坡、`DATABASE_URL` 是否使用 Pooled connection string，以及中国大陆网络是否能稳定访问当前域名。函数区域不能解决 Vercel 默认域名在部分网络中的可达性问题，正式使用仍建议绑定自定义域名。

[返回：配置 Vercel 项目 →](/guide/06-vercel)
