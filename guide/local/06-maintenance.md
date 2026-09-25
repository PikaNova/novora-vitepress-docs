# 6. 更新与维护

本地部署没有 Vercel 的自动部署和回滚面板，更新、备份和日志都要在服务器上自己做。本篇给出可以直接复制执行的流程。

::: tip 与云端维护的区别
云端靠 Sync fork + Vercel 自动部署，回滚用 Deployments 面板；本地靠 `git pull` + 重建，回滚用代码版本和数据库备份。云端维护见 [Vercel 日常维护](/guide/vercel/09-maintenance)。
:::

## 更新前原则

1. 阅读目标版本的 Release Notes 和升级说明；
2. 确认当前运行版本（后台“系统设置 → 关于”）；
3. **备份数据库**；
4. 记下当前提交号，便于回滚；
5. 避开考试和上课高峰；
6. 更新后执行一次核心验收。

## 方式一：Docker Compose 更新

### 使用一键脚本

```bash
cd /opt/novora
./update-local.sh          # Linux / macOS
# Windows 服务器双击 update-local.bat
```

### 手动执行

```bash
cd /opt/novora

# 1. 备份数据库
sudo docker compose exec db pg_dump -U novora -d novora -F c -f /tmp/novora.dump
sudo docker compose cp db:/tmp/novora.dump ./novora-$(date +%F).dump

# 2. 记录当前提交，便于回滚
git rev-parse --short HEAD

# 3. 拉取新代码并重建
sudo git pull
sudo docker compose up -d --build

# 4. 查看启动日志
sudo docker compose logs -f app
```

### 验证更新结果

```bash
sudo docker compose ps                      # 容器应为 running
curl -s http://127.0.0.1:3000/api/time      # 应返回 JSON
```

再登录后台确认版本号已变化，并检查首页、后台保存、大屏和 PDF。

## 方式二：Node 部署更新

```bash
cd /opt/novora

# 1. 备份数据库
pg_dump --dbname="生产连接串" --format=custom --no-owner --no-privileges \
  --file=novora-$(date +%F).dump

# 2. 记录当前提交
git rev-parse --short HEAD

# 3. 拉取并重建
git pull
npm install
npm run build

# 4. 重启服务
sudo systemctl restart novora
sudo systemctl status novora
```

## 更新失败时回滚

### 代码回滚

```bash
cd /opt/novora
git log --oneline -10          # 找到更新前的提交
git checkout <更新前的提交>     # 或 git reset --hard <提交>（会丢弃本地改动）
sudo docker compose up -d --build
```

使用 `git reset --hard` 前确认本地没有需要保留的自定义改动。更稳妥的做法是在部署时用 `git tag` 给可用版本打标签，回滚时 `git checkout <标签>`。

### 数据库回滚

::: warning 代码回滚不等于数据库回滚
如果新版本已经改变了数据库数据，恢复旧代码不一定能恢复数据状态。数据库恢复必须基于更新前的备份评估，不能盲目覆盖生产库。
:::

```bash
# Docker 方式：恢复到备份文件
sudo docker compose cp ./novora-YYYY-MM-DD.dump db:/tmp/restore.dump
sudo docker compose exec db pg_restore -U novora -d novora --clean --no-owner /tmp/restore.dump

# Node 方式
pg_restore --dbname="生产连接串" --clean --no-owner novora-YYYY-MM-DD.dump
```

恢复前先在一套独立数据库上演练，确认管理员登录、学校结构和考试数据完整。

## 记录表维护脚本（V2.8.0）

两个一次性脚本，平时不需要跑。执行前先**备份数据库**，并避开考试和上课时段；
脚本读取环境里的 `DATABASE_URL`，在项目目录里执行。

```bash
# 1. 旧考试的记录缺少时间窗与时间戳时回填
npm run backfill:record-timestamps

# 2. 清理「快照已删除、记录表还留着」的孤儿记录
npm run purge:orphan-records                              # 只统计，不删除
npm run purge:orphan-records -- --yes                     # 确认后真的删除
npm run purge:orphan-records -- --yes --with-operations   # 连带删除这些考试的操作日志
```

Docker 部署时，在宿主机项目目录执行即可；容器内的数据库服务不会因此重启。
孤儿记录在界面上看不到（列表按快照过滤），但会一直累积，建议每学期清理一次。
默认不动 `exam_record_operations`：那是审计与操作历史，留着比删掉安全。

## 数据备份

### Docker 方式

数据库数据保存在 Docker 卷 `novora_pgdata`。两种备份方式：

```bash
# 逻辑备份（推荐，可跨版本恢复）
sudo docker compose exec db pg_dump -U novora -d novora -F c -f /tmp/novora.dump
sudo docker compose cp db:/tmp/novora.dump ./novora-$(date +%F).dump

# 卷备份（整卷快照，恢复时需要相同环境）
sudo docker run --rm -v novora_pgdata:/data -v $(pwd):/backup \
  alpine tar czf /backup/novora-pgdata-$(date +%F).tar.gz -C /data .
```

### Node 方式

```bash
pg_dump --dbname="生产连接串" --format=custom --no-owner --no-privileges \
  --file=novora-$(date +%F).dump
```

### 备份策略建议

| 周期 | 工作 |
| --- | --- |
| 每次更新前 | 完整备份 + 记录提交号 |
| 每周 | 一次完整备份，检查文件可读 |
| 每月 | 执行一次恢复演练（在独立库上） |
| 每学期 | 归档一份长期备份到离线介质 |

备份文件包含管理员密码哈希和全部考试数据，应加密保存并限制访问。

## 查看日志

### Docker 方式

```bash
# 实时查看应用日志
sudo docker compose logs -f app

# 查看最近 200 行
sudo docker compose logs --tail=200 app

# 查看数据库日志
sudo docker compose logs --tail=100 db
```

### Node / systemd 方式

```bash
sudo journalctl -u novora -n 200 --no-pager
sudo journalctl -u novora -f
```

### 应用内诊断日志（V2.8.0 起）

管理员可以在 **系统设置 → 诊断日志** 配置本机错误包的保留天数（1–30 天）和采集范围。日志默认只留在这台设备上，需要作者协助排查时，管理员手动点一次上传即可。纯内网环境下上传会自动跳过，不影响核心功能。

## 账号与安全维护

建议每月检查：

- 超级管理员数量与停用账号；
- 年级和班级授权范围；
- 审计日志中的异常删除、重置操作；
- `.env` 是否被无关人员读取；
- Docker 卷和备份文件的访问权限。

## 服务器维护

- 服务器重启后确认容器自动拉起（`restart: unless-stopped` 或 systemd `enable`）；
- 固定局域网 IP，避免 DHCP 变更导致大屏失联；
- 磁盘剩余空间不足会影响数据库写入，建议监控数据卷所在分区；
- 更新 Docker 或 Node 版本前先在测试环境验证；
- 反向代理的证书到期前确认自动续期正常。

## 推荐维护周期

| 周期 | 工作 |
| --- | --- |
| 每周 | 检查容器状态、磁盘空间、关键页面 |
| 每月 | 数据备份、账号权限和审计日志检查 |
| 每学期 | 校历、周次、节假日、年级班级和设备复核 |
| 每次更新前 | 读发布说明、备份、记录提交号、安排窗口 |
| 每次更新后 | 执行核心验收并记录版本 |

遇到问题时进入[故障排查](/appendix/a-troubleshooting)。
