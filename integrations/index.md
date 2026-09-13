# 集成与 API

Novora 除了网页端，还对外提供两种接入方式：

| 接入方式 | 用途 | 适用对象 |
| --- | --- | --- |
| [ClassIsland 插件](/integrations/classisland/01-overview) | 在教室端同步考试并在开考前自动打开大屏、发送提醒 | 已使用 ClassIsland 的教室 |
| [考试数据接口](/integrations/02-api) | 按班级读取有效考试时间线 | 自研看板、班牌、第三方系统 |

## 选哪一个

只是想「教室里自动提醒考试」，用现成的 ClassIsland 插件即可，不需要写代码。

想把考试数据接到自研的班牌、电子屏或校园系统，看[考试数据接口](/integrations/02-api)。

## 共同的前置条件

无论哪种方式，都需要：

1. Novora 主站已经部署并完成学校初始化；
2. 已创建需要访问的年级和班级；
3. 接入设备能访问 Novora 的正式域名或内网地址。

## 版本兼容

插件和接口在 v2.7 / v2.8 保持兼容。升级 Novora 主程序后，插件不需要同步升级，也不需要重新配对。完整说明见[版本兼容与升级](/appendix/e-version-compatibility#classisland-插件兼容)。
