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
      text: 查看故障排查
      link: /appendix/a-troubleshooting

features:
  - title: 完整主线
    details: GitHub、Neon、Vercel、自定义域名、初始化和上线验收全部覆盖。
  - title: 面向零基础
    details: 每一步说明点击位置、填写内容、成功标志和常见错误。
  - title: 可持续维护
    details: 包含更新、备份、日志、回滚、ClassIsland 与遥测后台说明。
---

## 推荐阅读方式

第一次部署时，请按左侧目录从第 1 章连续阅读到第 10 章。准备正式投入使用前，再完成第 11 章的安全与上线检查。

已有部署出现问题时，可以直接进入[故障排查](/appendix/a-troubleshooting)。开发者需要修改源码时，请阅读[本地开发](/appendix/b-local-development)。

::: warning 中国大陆访问说明
Vercel 分配的 `*.vercel.app` 地址在中国大陆可能无法访问或不稳定。本文会在首次初始化前指导你绑定自定义域名。自定义域名只能改善入口可用性，不能把 Vercel 节点变成中国大陆节点，也不能保证所有运营商线路稳定。
:::

![Novora 项目预览](/preview.png)
