# 1. 插件总览

Novora 的 ClassIsland「考试提醒」插件是可选集成。它会同步当前设备绑定班级的考试，并通过 ClassIsland 在开考前自动打开大屏、发送提醒。

源码在 Novora 仓库的 `integrations/ClassIsland.ExamReminder`，也可从 [ClassIsland.ExamReminder 仓库](https://github.com/PikaNova/ClassIsland.ExamReminder) 获取。

## 主要功能

- 在 ClassIsland 设置中提供「考试提醒」页面；
- 只需填写 Novora 基础网址，其余路径自动生成；
- 通过浏览器一次性配对，不在插件里保存管理员密码；
- 每 30 秒同步一次考试时间线；
- 使用服务端时间校正调度，避免教室电脑时钟不准；
- 开考前至少 20 分钟自动打开考试大屏；
- 在开考前 15 分钟、5 分钟和开考时提醒；
- 对提醒和浏览器动作持久化去重，不会重复弹窗。

具体时间与行为以当前插件版本界面和发布说明为准。

## 前置条件

- Novora 主站已经部署并完成学校初始化；
- 正式域名或内网地址在教室设备上可访问；
- 已创建需要绑定的年级和班级；
- 教室设备可以运行 ClassIsland 2.x；
- 已取得与当前 Novora 版本配套的 `.cipx` 插件包，或具备自行构建条件。

## 安装插件

优先使用项目发布页提供的正式 `.cipx` 文件。在 ClassIsland 的插件管理界面导入或安装，并按 ClassIsland 提示重启或重新加载。

不要使用来源不明、版本不匹配或被重新打包的插件。正式包应结合发布方提供的 SHA-256 校验值验证完整性。

## 工作流程

```text
插件填写 Novora 基础网址
        │
        ▼
插件请求一次性配对令牌（5 分钟有效）
        │
        ▼
浏览器打开 /plugin/connect?token=...
        │
        ▼
网页中选择年级与班级，确认连接
        │
        ▼
插件每 30 秒同步该班级的考试时间线
        │
        ▼
开考前自动打开大屏并发送提醒
```

## 与设备管理的关系

配对成功后，Novora 设备管理会把关联的网页看板和 ClassIsland 插件视为**同一台设备**，管理员可以统一查看在线状态、当前考试和绑定班级。

删除设备会同时解除网页看板与插件的绑定，插件需要重新配对。

## 下一步

- 开始配对：[配对与设备绑定](/integrations/classisland/02-pairing)
- 接口细节：[接口与兼容](/integrations/classisland/03-api)
- 遇到问题：[常见问题](/integrations/classisland/04-faq)
