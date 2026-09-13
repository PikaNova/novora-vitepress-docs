# 3. 接口与兼容

本篇面向需要自查同步逻辑或做二次开发的场景。普通使用者只需要配对，不需要看这里。

## 插件使用的接口

插件复用 Novora 的 `/api/exams`，主要 action 包括：

| action | 作用 |
| --- | --- |
| `plugin-pair-start` | 发起一次配对，生成 5 分钟有效的一次性令牌 |
| `plugin-pair-status` | 查询配对状态 |
| `plugin-bootstrap` | 首次同步，获取学校信息与考试来源 |
| `plugin-api` | 日常同步有效考试时间线 |

## API 版本

API v2 提供能力探测、学校信息和考试来源。旧插件没有发送版本字段时，服务端保留 API v1 兼容路径，因此老版本插件仍可继续工作。

## 同步行为

| 项目 | 说明 |
| --- | --- |
| 同步间隔 | 每 30 秒 |
| 时间基准 | 使用服务端时间校正，避免教室电脑时钟偏差 |
| 数据范围 | 仅当前绑定班级的有效考试 |
| 自动打开大屏 | 开考前至少 20 分钟 |
| 提醒时间点 | 开考前 15 分钟、5 分钟、开考时 |
| 去重 | 提醒与浏览器动作都会持久化去重 |

## 数据边界

插件只能读到**当前绑定班级**的考试安排。它不会获得：

- 管理员账号或密码；
- 其他班级的考试数据；
- 学校用户列表；
- 数据库连接信息。

客户端密钥只保存 SHA-256 摘要，服务端无法还原原始密钥。

## 自行构建插件

安装 .NET 8 SDK 后，在 Novora 仓库根目录执行：

```bash
dotnet build integrations/ClassIsland.ExamReminder/ClassIsland.ExamReminder.csproj -c Release
```

项目目标为 `net8.0-windows`，使用 `ClassIsland.PluginSdk 1.7.106.2-dev-v2` 和 `apiVersion: 2`。也可按项目发布配置生成插件包：

```powershell
dotnet publish -p:CreateCipx=true
```

源码目录可能不包含正式发布图标。对外分发前应补齐图标、版本、清单并生成校验值。

## 版本兼容

Novora 主程序在 v2.7 / v2.8 保持插件接口兼容：

- 升级主程序后插件不需要同步升级；
- 已完成的配对不需要重做；
- 设备管理中的关联状态保持不变；
- 如果要修改插件自己使用的品牌标识，注意不要改动插件 ID、程序集名和 API 版本逻辑。

## 相关

- 配对流程：[配对与设备绑定](/integrations/classisland/02-pairing)
- 给自研看板接入考试数据：[考试数据接口](/integrations/02-api)
- 兼容总览：[版本兼容与升级](/appendix/e-version-compatibility)
