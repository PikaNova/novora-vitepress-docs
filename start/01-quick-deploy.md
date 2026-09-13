# 五分钟上手部署

这一页只给动作和判断标准，不讲原理。卡住时点开对应章节看详细步骤。

## 先准备三样东西

不管走哪条路，都要先有：

1. 一个能收验证邮件的邮箱；
2. 一个独立的高强度管理员密码（12 位以上，别用学校名或手机号）；
3. 学校信息：校名、省份、年级和班级列表、学期开始日期。

顺手准备一个能保存密码的地方——初始化最后会生成一个只显示一次的恢复密钥。

## 路线 A：Vercel 云端

### 最短路径

1. **Fork 仓库** —— 打开 [PikaNova/Novora](https://github.com/PikaNova/Novora)，点右上角 **Fork**。
2. **建数据库** —— 在 [Neon](https://console.neon.tech/) 新建项目，Region 选 **AWS Asia Pacific 1 (Singapore)**，复制 **Pooled connection string**。
3. **导入 Vercel** —— 在 [Vercel](https://vercel.com/dashboard) 导入刚 Fork 的仓库，填两个环境变量：

   ```text
   DATABASE_URL   = Neon 的 Pooled 连接串
   ADMIN_PASSWORD = 你的管理员密码
   ```

   点 **Deploy**，等状态变成 **Ready**。
4. **加 Deploy Hook** —— 部署成功后在 Vercel **Settings → Git → Deploy Hooks** 创建 `main` 分支的钩子，把完整 URL 填进环境变量 `VERCEL_DEPLOY_HOOK_URL`，然后 Redeploy 一次。
5. **绑域名** —— **Settings → Domains** 添加 `exam.example.com`，按页面给的记录在你的域名服务商加 CNAME。
6. **初始化** —— 打开域名，点「开始初始化」，用 `admin` + `ADMIN_PASSWORD` 登录，按向导走完并保存恢复密钥。

### 怎么算成功

- [ ] Vercel 最新部署是 **Ready**
- [ ] 域名状态是 **Valid Configuration**，HTTPS 正常
- [ ] 首页能打开，`/api/time` 返回 JSON
- [ ] 用新密码能登录后台
- [ ] 恢复密钥已经存到安全位置

详细步骤和常见报错：[Vercel 云端部署主线](/guide/vercel/01-source-code)。

## 路线 B：本地 / 内网

### 最短路径

需要一台能长期开机的电脑或服务器，装好 Docker。

```bash
sudo mkdir -p /opt/novora && cd /opt/novora
sudo git clone https://github.com/PikaNova/Novora.git .
sudo cp .env.example .env
sudo nano .env          # 填入 ADMIN_PASSWORD
sudo docker compose up -d --build
```

启动后打开 `http://服务器局域网IP:3000`，用 `admin` + `ADMIN_PASSWORD` 登录，按向导完成初始化。

### 怎么算成功

- [ ] `sudo docker compose ps` 里 `app` 和 `db` 都是 running
- [ ] 本机 `curl http://127.0.0.1:3000/api/time` 返回 JSON
- [ ] **内网其他设备**也能打开 `http://服务器IP:3000`（打不开先看防火墙）
- [ ] 用新密码能登录后台
- [ ] 重启容器后数据还在（验证持久化）

详细步骤和常见问题：[本地部署总览](/guide/local/01-overview)｜[Docker Compose 部署](/guide/local/02-docker)。

## 下一步

部署只是开始。接着看[部署完的第一个小时](/start/02-first-hour)，把系统配置成能实际用的状态。
