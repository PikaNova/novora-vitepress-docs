---
layout: home

hero:
  name: Novora
  text: Novora 部署与使用文档
  tagline: 从部署、初始化到考试安排、设备管理和日常维护，按实际操作查找步骤。
  image:
    src: /icon-192.png
    alt: Novora
  actions:
    - theme: brand
      text: 开始部署
      link: /guide/01-introduction
    - theme: alt
      text: 学习功能
      link: /features/01-feature-overview
    - theme: alt
      text: Fork 作者仓库
      link: https://github.com/PikaNova/Novora/fork

features:
  - title: 官方交流群 1067566386
    details: 部署和使用问题可入群咨询。请携带错误提示与 Request ID，不要发送密码、连接串、Deploy Hook 或恢复密钥。
  - title: 两条部署主线
    details: Vercel 云端与本地/内网各自独立成篇，从准备到上线验收全部覆盖。
  - title: 面向零基础
    details: 每一步说明点击位置、填写内容、成功标志和常见错误。
  - title: 管理员手册
    details: 按超级管理员、年级管理员、班级管理员、班级访客分工，附学期切换清单。
  - title: 日常维护
    details: 覆盖考试记录、更新、备份、诊断日志和回滚。
---

## 官方交流群

> **群号：`1067566386`**<br>
> 面向 Novora 部署、初始化和日常使用答疑。反馈故障时请提供页面错误和 Request ID，敏感环境变量必须打码。

## Vercel 云端部署

1. 在 GitHub Fork [PikaNova/Novora](https://github.com/PikaNova/Novora)，保留自己的 Fork `main` 分支。
2. 在 Neon 创建 AWS Singapore 数据库并复制 Pooled connection string。
3. 在 Vercel 新建 Project，导入自己的 Fork，填写 `DATABASE_URL` 和 `ADMIN_PASSWORD`，完成首次部署。
4. 在 Vercel 为 `main` 创建 Deploy Hook，加入必填变量 `VERCEL_DEPLOY_HOOK_URL` 后重新部署。
5. 将 Functions 设为 Singapore (`sin1`)，再绑定自定义域名。
6. 从首页进入初始化，修改密码并保存自动生成、只显示一次的恢复密钥。

::: warning Deploy Hook 的创建顺序
Hook 只有 Vercel 项目创建后才能生成，所以需要在首次部署后补充并 Redeploy。它只部署自己的 Fork `main` 分支；获取新版本必须先同步作者仓库。
:::

## 推荐阅读方式

**想尽快跑起来**：看[快速部署](/start/01-quick-deploy)，再按[部署后的检查清单](/start/02-first-hour)完成初始化和验收。

**第一次部署、想看详细步骤**：先看[选择部署方式](/guide/00-deploy-paths)确定走 Vercel 云端还是本地/内网，再按对应主线连续阅读。Vercel 主线 9 篇，本地主线 6 篇。

**部署完成后**：从[功能总览](/features/01-feature-overview)开始学习六个管理模块，再按自己的角色读[管理员手册](/admin/)。

**刚升级到 V2.8.0**：先看[新功能速览](/features/00-whats-new)，重点是操作方式的变化——新建考试即发布、到点由系统自动开考、提前收场改用「申请停止」。

**第一次在全校推广**：[第一次全校上线](/playbooks/01-go-live)按时间线给出上线前两周到上线后一周的完整流程；考试期间看[考试当天](/playbooks/02-exam-day)。

**我是老师，只想看本班考试**：[老师视角](/start/05-teacher)。

**日常使用有疑问**：查[常见问题](/faq/)；已经出现报错时进[故障排查](/appendix/a-troubleshooting)。

**升级版本前**：看[版本兼容与升级](/appendix/e-version-compatibility)和[更新日志](/changelog)。

**遇到不认识的词**：[术语表](/start/04-glossary)。

**访问速度慢**：[中国大陆访问与加速](/guide/network/01-cn-access)。

::: warning 中国大陆访问说明
Vercel 分配的 `*.vercel.app` 地址在中国大陆可能无法访问或不稳定。本文会在首次初始化前指导你绑定自定义域名。自定义域名只能改善入口可用性，不能把 Vercel 节点变成中国大陆节点，也不能保证所有运营商线路稳定。
:::

![Novora 项目预览](/preview.png)
