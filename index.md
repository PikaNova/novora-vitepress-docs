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

features:
  - title: 完整主线
    details: GitHub、Neon、Vercel、自定义域名、初始化和上线验收全部覆盖。
  - title: 面向零基础
    details: 每一步说明点击位置、填写内容、成功标志和常见错误。
  - title: 可持续维护
    details: 包含六个模块、考试与周测操作、更新、备份、日志和回滚说明。
---

## 推荐阅读方式

第一次部署时，请按左侧目录从第 1 章连续阅读到第 10 章。准备正式投入使用前，再完成第 11 章的安全与上线检查。

部署完成后，从[功能总览](/features/01-feature-overview)开始学习六个管理模块，也可以直接查看[创建大型考试](/features/08-create-major-exam)或[创建周测](/features/09-create-weekly-test)。已有部署出现问题时，进入[故障排查](/appendix/a-troubleshooting)。

::: warning 中国大陆访问说明
Vercel 分配的 `*.vercel.app` 地址在中国大陆可能无法访问或不稳定。本文会在首次初始化前指导你绑定自定义域名。自定义域名只能改善入口可用性，不能把 Vercel 节点变成中国大陆节点，也不能保证所有运营商线路稳定。
:::

![Novora 项目预览](/preview.png)
