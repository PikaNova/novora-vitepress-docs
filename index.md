---
layout: home

hero:
  name: Novora
  text: 从零部署与维护指南
  tagline: 面向零基础用户，从注册账号、创建数据库到正式上线，一步一步完成部署。
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
      text: GitHub 一键部署
      link: https://vercel.com/new/clone?repository-url=https%3a%2f%2fgithub.com%2fPikaNova%2fNovora&project-name=novora-board&repository-name=novora-board&env=DATABASE_URL,ADMIN_PASSWORD

features:
  - title: 官方交流群 1067566386
    details: 部署和使用问题可入群咨询。请携带错误提示与 Request ID，不要发送密码、连接串、Deploy Hook 或恢复密钥。
  - title: 完整主线
    details: GitHub、Neon、Vercel、自定义域名、初始化和上线验收全部覆盖。
  - title: 面向零基础
    details: 每一步说明点击位置、填写内容、成功标志和常见错误。
  - title: 可持续维护
    details: 包含六个模块、考试与周测操作、更新、备份、日志和回滚说明。
---

## 官方交流群

> **群号：`1067566386`**<br>
> 面向 Novora 部署、初始化和日常使用答疑。反馈故障时请提供页面错误和 Request ID，敏感环境变量必须打码。

## 五步简易部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3a%2f%2fgithub.com%2fPikaNova%2fNovora&project-name=novora-board&repository-name=novora-board&env=DATABASE_URL,ADMIN_PASSWORD&envDescription=请填写%20Neon%20连接字符串和超级管理员初始密码)

1. 在 Neon 创建 AWS Singapore 数据库并复制 Pooled connection string。
2. 点击上方按钮，填写 `DATABASE_URL` 和 `ADMIN_PASSWORD`，完成首次部署。
3. 在 Vercel 为 `main` 创建 Deploy Hook，加入必填变量 `VERCEL_DEPLOY_HOOK_URL` 后重新部署。
4. 将 Functions 设为 Singapore (`sin1`)，再绑定自定义域名。
5. 从首页进入初始化，修改密码并保存自动生成、只显示一次的恢复密钥。

::: warning Deploy Hook 的创建顺序
Hook 只有 Vercel 项目创建后才能生成，所以需要在首次部署后补充并 Redeploy。它部署当前项目连接仓库的 `main` 分支；Fork 用户需先同步上游。
:::

## 推荐阅读方式

第一次部署时，请按左侧目录从第 1 章连续阅读到第 10 章。准备正式投入使用前，再完成第 11 章的安全与上线检查。

部署完成后，从[功能总览](/features/01-feature-overview)开始学习六个管理模块，也可以直接查看[创建大型考试](/features/08-create-major-exam)或[创建周测](/features/09-create-weekly-test)。已有部署出现问题时，进入[故障排查](/appendix/a-troubleshooting)。

已经完成首次部署的管理员，可直接阅读[创建 Vercel Deploy Hook](/guide/07-environment#创建-deploy-hook正式部署必做)和[后续版本完整更新流程](/guide/12-maintenance)。

::: warning 中国大陆访问说明
Vercel 分配的 `*.vercel.app` 地址在中国大陆可能无法访问或不稳定。本文会在首次初始化前指导你绑定自定义域名。自定义域名只能改善入口可用性，不能把 Vercel 节点变成中国大陆节点，也不能保证所有运营商线路稳定。
:::

![Novora 项目预览](/preview.png)
