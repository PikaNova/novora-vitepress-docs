# 附录 C：ClassIsland 插件

Novora 的 ClassIsland“考试提醒”插件是可选集成。它会同步当前设备绑定班级的考试，并通过 ClassIsland 提醒 API 显示开考提醒。

## 前置条件

- Novora 主站已经部署并完成学校初始化；
- 自定义域名在教室设备上可访问；
- 已创建需要绑定的年级和班级；
- ClassIsland 2.x 可正常运行；
- 已取得与当前 Novora 版本配套的 `.cipx` 插件包，或具备自行构建条件。

## 主要功能

- 在 ClassIsland 设置中提供“考试提醒”页面；
- 只需填写 Novora 基础网址；
- 通过浏览器一次性配对；
- 每 30 秒同步考试时间线；
- 使用服务端时间校正调度；
- 开考前至少 20 分钟自动打开考试大屏；
- 在开考前 15 分钟、5 分钟和开考时提醒；
- 对提醒和浏览器动作持久化去重。

具体时间与行为以当前插件版本界面和发布说明为准。

## 安装插件

优先使用项目发布页提供的正式 `.cipx` 文件。在 ClassIsland 的插件管理界面导入或安装插件，并按 ClassIsland 提示重启或重新加载。

不要使用来源不明、版本不匹配或被重新打包的插件。正式包应结合发布方提供的 SHA-256 校验值验证完整性。

## 填写 Novora 地址

在插件设置中只填写基础网址，例如：

```text
https://exam.example.com
```

不要填写：

```text
https://exam.example.com/login
https://exam.example.com/api/exams
https://exam.example.com/exam
```

插件会自动生成 API、配对页和考试大屏路径。

## 浏览器配对

1. 在插件中点击开始配对。
2. 插件向 Novora 请求一次性配对令牌。
3. 系统浏览器打开 `/plugin/connect?token=...`。
4. 在网页中选择正确年级和班级。
5. 确认连接。
6. 返回 ClassIsland 查看同步状态。

配对令牌有效期为 5 分钟。超时后不要重复使用旧页面，应回到插件重新发起配对。

插件客户端密钥只以 SHA-256 摘要保存，接口不会返回原始密钥。

## 服务端协议

插件复用 Novora 的 `/api/exams`，主要 action 包括：

```text
plugin-api
plugin-pair-start
plugin-pair-status
plugin-bootstrap
```

API v2 提供能力探测、学校信息和考试来源。旧插件没有发送版本字段时，服务端保留 API v1 兼容路径。

## 设备管理

成功配对后，Novora 设备管理会把关联的网页看板和 ClassIsland 插件视为同一台设备。管理员可以查看在线状态、当前考试和绑定班级。

删除设备会解除两端绑定，插件需要重新配对。更换教室或班级后，应在后台解除旧绑定并重新选择，避免显示错误范围。

## 自行构建插件

安装 .NET 8 SDK 后，在 Novora 仓库根目录执行：

```bash
dotnet build integrations/ClassIsland.ExamReminder/ClassIsland.ExamReminder.csproj -c Release
```

项目目标为 `net8.0-windows`，使用 `ClassIsland.PluginSdk 1.7.106.2-dev-v2` 和 `apiVersion: 2`。也可按项目发布配置执行：

```powershell
dotnet publish -p:CreateCipx=true
```

源码目录可能不包含正式发布图标。对外分发前应补齐图标、版本、清单并生成校验值。

## 常见问题

**无法打开配对页**

先在同一设备浏览器中打开 Novora 基础网址和 `/api/time`。检查自定义域名、HTTPS、默认浏览器和学校网络。

**提示配对令牌过期**

回到插件重新开始配对，不要刷新或复用旧 token 页面。

**同步不到考试**

确认插件绑定的班级正确，考试范围包含该班级，考试已启用，并检查 Novora 后台设备状态。

**删除设备后停止同步**

这是预期行为。删除设备会撤销凭据，必须重新配对。

**Linux 无法打开浏览器**

插件先使用系统默认方式，失败后会尝试 `xdg-open` 和 `gio open`。应确认桌面环境存在默认浏览器和相应命令。
