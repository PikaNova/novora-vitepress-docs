# 备份与恢复操作

备份的价值不在"有文件"，而在"能恢复"。这篇给出备份策略、具体命令和恢复演练方法。

## 备份策略

| 时机 | 做什么 | 保留几份 |
| --- | --- | --- |
| 每次更新前 | 完整备份 + 记录提交号 | 保留到下次更新验收通过 |
| 每周 | 一次完整备份 | 保留最近 4 份 |
| 每月 | 一次完整备份 + 一次恢复演练 | 保留最近 6 份 |
| 每学期 | 归档到离线介质 | 长期保留 |

备份文件包含管理员密码哈希和全部考试数据，属于敏感数据。加密保存，并限制访问。

## 云端（Neon）备份

```bash
pg_dump --dbname="生产连接串" --format=custom --no-owner --no-privileges \
  --file=novora-$(date +%F).dump
```

也可以使用 Neon 自带的项目分支或恢复能力。做恢复演练时**必须用独立的 Neon 项目或分支**，不要直接在生产库上试。

## 本地（Docker）备份

```bash
# 逻辑备份：推荐，可跨版本恢复
sudo docker compose exec db pg_dump -U novora -d novora -F c -f /tmp/novora.dump
sudo docker compose cp db:/tmp/novora.dump ./novora-$(date +%F).dump

# 数据卷备份：整卷快照，恢复环境需一致
sudo docker run --rm -v novora_pgdata:/data -v $(pwd):/backup \
  alpine tar czf /backup/novora-pgdata-$(date +%F).tar.gz -C /data .
```

优先用逻辑备份。数据卷备份适合整机迁移，但不便于跨版本恢复。

## 本地（Node + PostgreSQL）备份

```bash
pg_dump --dbname="生产连接串" --format=custom --no-owner --no-privileges \
  --file=novora-$(date +%F).dump
```

## 恢复

### 恢复到新数据库（推荐做法）

```bash
# 先建一个空库
createdb -h 127.0.0.1 -U novora novora-restore

# 恢复
pg_restore --dbname="postgresql://novora:密码@127.0.0.1:5432/novora-restore" \
  --no-owner --no-privileges novora-2026-09-13.dump
```

先恢复到新库，验收通过后再切换连接串。这样不会破坏现有数据。

### 覆盖现有数据库

```bash
pg_restore --dbname="生产连接串" --clean --no-owner --no-privileges novora-2026-09-13.dump
```

::: danger 覆盖是不可逆操作
`--clean` 会先删除现有对象再重建。执行前必须确认：备份文件是完整的、正在维护窗口内、已经通知使用方、并且没有别的管理员在操作系统。
:::

### 从数据卷备份恢复（Docker）

```bash
sudo docker compose down
sudo docker run --rm -v novora_pgdata:/data -v $(pwd):/backup \
  alpine sh -c "rm -rf /data/* && tar xzf /backup/novora-pgdata-2026-09-13.tar.gz -C /data"
sudo docker compose up -d
```

## 恢复演练怎么做

每学期至少做一次，流程就是生产恢复的预演：

1. 准备一套独立数据库（Neon 分支或本机新库）；
2. 用最近一次备份恢复；
3. 指向该库启动一套测试实例；
4. 逐项验收：管理员登录、学校结构、考试数据、用户权限、PDF；
5. 记录用时和遇到的问题；
6. 演练完成后销毁测试库。

只有演练成功的备份才算可靠备份。

## 恢复后的验收清单

- [ ] 管理员能用现有密码登录
- [ ] 年级与班级结构完整
- [ ] 大型考试与周测数据完整
- [ ] 考试记录与操作历史可查
- [ ] 用户、角色与数据范围正确
- [ ] 设备绑定关系正常
- [ ] 教室大屏显示正确
- [ ] PDF 能正常下载

## 备份文件怎么命名和保存

推荐带日期和版本：

```text
novora-2026-09-13-v2.8.0.dump
novora-2026-09-13-v2.8.0.dump.sha256
```

保存位置：

- 本地磁盘：方便快速恢复；
- 网络存储或 NAS：防止单机故障；
- 离线介质：每学期归档一份，防勒索与误删。

生成校验值：

```bash
sha256sum novora-2026-09-13-v2.8.0.dump > novora-2026-09-13-v2.8.0.dump.sha256
```

恢复前先校验，避免用到损坏的备份。

## 相关

- 云端维护流程：[Vercel 日常维护](/guide/vercel/09-maintenance)
- 本地维护流程：[更新与维护](/guide/local/06-maintenance)
- 数据存放位置：[数据与备份](/faq/05-data)
