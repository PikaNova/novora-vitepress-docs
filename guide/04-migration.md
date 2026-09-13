# 迁移与更换部署方式

从 Vercel 换到本地、从本地换到云端、换数据库、换域名——这篇给出可照做的步骤。共同原则是：**先让新环境跑起来，再迁移数据，验证通过后再停旧的。**

## 通用步骤

```text
1. 备份源数据
2. 在目标环境完成一次干净部署
3. 把数据恢复到目标数据库
4. 切换目标环境的连接串
5. 完整验收
6. 确认无误后再停用旧实例
```

顺序不能颠倒。先建新、后迁移、最后停旧，出问题时随时可以退回。

## 场景一：从 Vercel 迁到本地

### 迁移前

- [ ] 确认本地服务器已部署并能正常登录（[本地部署总览](/guide/local/01-overview)）
- [ ] 记录当前版本（后台「系统设置 → 关于」）
- [ ] 通知使用方暂停录入

### 迁移步骤

1. **备份 Neon 数据**

   ```bash
   pg_dump --dbname="Neon 生产连接串" --format=custom --no-owner --no-privileges \
     --file=novora-cutover.dump
   ```

2. **恢复到本地数据库**

   ```bash
   sudo docker compose cp ./novora-cutover.dump db:/tmp/restore.dump
   sudo docker compose exec db pg_restore -U novora -d novora --clean --no-owner /tmp/restore.dump
   ```

   无 Docker 部署时把 `pg_restore` 直接指向本机连接串。

3. **确认本地环境变量**

   `.env` 中的 `DATABASE_URL` 指向本地数据库，`ADMIN_PASSWORD` 保留原值（已有管理员密码以数据库为准，不受影响）。

4. **重启并验收**

   ```bash
   sudo docker compose up -d --build
   ```

5. 完整验收见下文清单。

### 验收通过后

- 通知使用方改用新的内网地址；
- 让每台教室设备重新选择班级（域名变了，本机绑定也要重做）；
- ClassIsland 插件重新填写地址并重新配对；
- Neon 项目暂时**不要删**，保留一到两周作为回退方案。

## 场景二：从本地迁到 Vercel

1. 在 Vercel 完成一次干净部署（[Vercel 部署主线](/guide/vercel/01-source-code)）；
2. 从本地导出：

   ```bash
   sudo docker compose exec db pg_dump -U novora -d novora -F c -f /tmp/novora.dump
   sudo docker compose cp db:/tmp/novora.dump ./novora-migrate.dump
   ```

3. 恢复到 Neon：

   ```bash
   pg_restore --dbname="Neon 连接串" --clean --no-owner novora-migrate.dump
   ```

4. 确认 Vercel 的 `DATABASE_URL` 指向该 Neon 项目；
5. 重新部署一次让变量生效；
6. 验收通过后再停用本地实例。

## 场景三：只换数据库

不换部署方式，只把数据库换到另一套 PostgreSQL：

1. 备份源库；
2. 在目标实例上创建库和账号；
3. 恢复数据；
4. 修改环境变量 `DATABASE_URL`；
5. **重新部署或重启**（环境变量只对新进程生效）；
6. 验收。

::: warning 环境变量改了不重启等于没改
云端修改环境变量后必须重新部署；本地修改 `.env` 后必须重启容器或服务。
:::

## 场景四：换域名

1. 在新域名上完成解析和 HTTPS；
2. 在 Vercel（或反向代理）把新域名设为主域名；
3. 确认 `/api/time` 在新域名下返回 JSON；
4. 让教室设备改用新地址；
5. 插件重新填写地址并重新配对；
6. 旧域名保留一段时间的跳转，再停用。

域名变化会影响设备的本机绑定和插件配对，这部分必须重做，不能只改解析。

## 迁移必做的验收清单

- [ ] 管理员能用原密码登录
- [ ] 学校结构、年级、班级完整
- [ ] 大型考试与周测数据完整
- [ ] 考试记录与操作历史可查
- [ ] 用户、角色、数据范围正确
- [ ] 设备绑定关系正常（或已重新绑定）
- [ ] 教室大屏显示正确
- [ ] PDF 能正常下载
- [ ] ClassIsland 插件同步正常（如启用）
- [ ] 操作日志与审计记录可查

## 迁移前必须做的

- **备份**。迁移过程中任何一步出错，备份是唯一的退路。
- **演练**。在生产切换前，先在独立数据库上把恢复流程走一遍。
- **选时间**。避开考试和上课时段，并提前通知使用方。

## 相关

- 数据存放位置：[数据与备份](/faq/05-data)
- 备份操作手册：[备份与恢复操作](/guide/05-backup)
- 两条部署主线：[选择部署方式](/guide/00-deploy-paths)
