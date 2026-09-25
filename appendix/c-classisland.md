# 附录 C：ClassIsland 插件（速查）

ClassIsland「考试提醒」是有独立发布仓库的对外集成，完整说明已经在「集成与 API」栏目成篇。
本篇只保留速查与跳转，避免两处各写一份、日后说法不一致。

| 想看什么 | 去哪篇 |
| --- | --- |
| 插件能做什么、前置条件、安装 | [插件总览](/integrations/classisland/01-overview) |
| 填写地址、发起配对、换教室、解除绑定 | [配对与设备绑定](/integrations/classisland/02-pairing) |
| 接口、同步行为、数据边界、版本兼容 | [接口与兼容](/integrations/classisland/03-api) |
| 打不开配对页、令牌过期、同步不到考试 | [插件常见问题](/integrations/classisland/04-faq) |

## 三条最常用的原则

- 配对令牌有效期 **5 分钟**，超时就回插件重新发起，不要刷新或复用旧页面；
- 客户端密钥只保存 SHA-256 摘要，接口不返回原始密钥；**删除设备会撤销凭据**，必须重新配对；
- 配对成功后，后台会把网页看板与插件视为**同一台教室设备**；换教室或班级要先解绑再重新选择。

## 自行构建

安装 .NET 8 SDK 后，在 Novora 仓库根目录执行：

```bash
dotnet build integrations/ClassIsland.ExamReminder/ClassIsland.ExamReminder.csproj -c Release
```

目标框架为 `net8.0-windows`，插件清单使用 `apiVersion: 2`。
打包、图标与分发要求见[接口与兼容](/integrations/classisland/03-api)。
