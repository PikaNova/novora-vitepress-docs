import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Novora 部署文档',
  description: 'Novora 从零部署、功能使用、管理员手册与维护指南（当前版本 V2.8.0）',
  sitemap: { hostname: 'https://docs.pikachu2026.space' },
  cleanUrls: true,
  lastUpdated: true,
  // 注意：这里不再使用 rewrites。
  // VitePress 的 rewrites 是「源文件 → 输出路径」一对一映射，之前把
  // guide/vercel/*.md 映射到 guide/04-source-code 等旧路径，结果新路径（侧边栏和正文使用的地址）
  // 反而 404，旧路径才有内容。保留旧地址改用下面的跳转页实现：
  //   guide/04-source-code.md … guide/12-maintenance.md、appendix/f-singapore-functions.md
  head: [
    ['link', { rel: 'icon', href: '/icon-192.png' }],
    ['meta', { name: 'theme-color', content: '#b42318' }]
  ],
  themeConfig: {
    logo: '/icon-192.png',
    siteTitle: 'Novora 文档',
    outline: { level: [2, 3], label: '本页目录' },
    lastUpdated: { text: '最后更新' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '外观',
    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/start/' },
      { text: '新功能', link: '/features/00-whats-new' },
      { text: '效果预览', link: '/effect/01-index' },
      { text: '部署', link: '/guide/00-deploy-paths' },
      { text: '功能使用', link: '/features/01-feature-overview' },
      { text: '管理员手册', link: '/admin/' },
      { text: '常见问题', link: '/faq/' },
      { text: '集成', link: '/integrations/' },
      { text: '更新日志', link: '/changelog' },
      { text: '项目仓库', link: 'https://github.com/PikaNova/Novora' }
    ],
    sidebar: [
      {
        text: '开始这里',
        collapsed: false,
        items: [
          { text: '快速开始', link: '/start/' },
          { text: '1. 五分钟上手部署', link: '/start/01-quick-deploy' },
          { text: '2. 部署完的第一个小时', link: '/start/02-first-hour' },
          { text: '3. 项目快速入门（开发者）', link: '/start/03-contributor' },
          { text: '4. 术语表', link: '/start/04-glossary' },
          { text: '5. 老师视角：怎么看考试安排', link: '/start/05-teacher' }
        ]
      },
      {
        text: '项目效果预览',
        collapsed: false,
        items: [
          { text: '1. 首页', link: '/effect/01-index' },
          { text: '2. 考试大屏', link: '/effect/02-screen' },
          { text: '3. 后台总览', link: '/effect/03-admin' },
          { text: '4. 大型考试', link: '/effect/04-major-exam' },
          { text: '5. 周测计划', link: '/effect/05-weekly' },
          { text: '6. 批量与导入', link: '/effect/06-batch-import' },
          { text: '7. 快速考试', link: '/effect/07-quick-start' },
          { text: '8. PDF 导出', link: '/effect/08-pdf' },
          { text: '9. 设备与用户', link: '/effect/09-devices-users' },
          { text: '10. 设置与更新', link: '/effect/10-settings-update' },
          { text: '11. ClassIsland', link: '/effect/11-classisland' },
          { text: '12. 考试记录管理', link: '/effect/12-exam-records' }
        ]
      },
      {
        text: '更新日志',
        collapsed: false,
        items: [
          { text: '更新日志', link: '/changelog' },
          { text: 'V2.8.0（当前版本）', link: '/changelog/v2.8.0' },
          { text: 'V2.7.4 – V2.7.6', link: '/changelog/v2.7.4-v2.7.6' },
          { text: 'V2.7.3', link: '/changelog/v2.7.3' },
          { text: 'V2.7.2', link: '/changelog/v2.7.2' },
          { text: 'V2.7.1', link: '/changelog/v2.7.1' },
          { text: 'V2.7.0', link: '/changelog/v2.7.0' },
          { text: 'V2.6.2', link: '/changelog/v2.6.2' },
          { text: 'V2.6.1', link: '/changelog/v2.6.1' },
          { text: 'V2.6.0', link: '/changelog/v2.6.0' }
        ]
      },
      {
        text: '部署：开始之前',
        collapsed: false,
        items: [
          { text: '0. 选择部署方式', link: '/guide/00-deploy-paths' },
          { text: '1. 项目介绍', link: '/guide/01-introduction' },
          { text: '2. 部署原理', link: '/guide/02-architecture' },
          { text: '3. 部署前准备', link: '/guide/03-prerequisites' }
        ]
      },
      {
        text: '部署：Vercel 云端',
        collapsed: false,
        items: [
          { text: '1. 获取项目源码', link: '/guide/vercel/01-source-code' },
          { text: '2. 创建 Neon 数据库', link: '/guide/vercel/02-neon' },
          { text: '3. 配置 Vercel 项目', link: '/guide/vercel/03-vercel' },
          { text: '4. 配置环境变量', link: '/guide/vercel/04-environment' },
          { text: '5. 首次部署与绑定域名', link: '/guide/vercel/05-first-deploy' },
          { text: '6. 首次登录和初始化', link: '/guide/vercel/06-initialization' },
          { text: '7. 部署验收', link: '/guide/vercel/07-acceptance' },
          { text: '8. 正式上线', link: '/guide/vercel/08-production' },
          { text: '9. 日常维护', link: '/guide/vercel/09-maintenance' }
        ]
      },
      {
        text: '部署：本地 / 内网',
        collapsed: false,
        items: [
          { text: '1. 本地部署总览', link: '/guide/local/01-overview' },
          { text: '2. Docker Compose 部署', link: '/guide/local/02-docker' },
          { text: '3. 无 Docker 部署', link: '/guide/local/03-node' },
          { text: '4. 反向代理与 HTTPS', link: '/guide/local/04-reverse-proxy' },
          { text: '5. 初始化与验收', link: '/guide/local/05-acceptance' },
          { text: '6. 更新与维护', link: '/guide/local/06-maintenance' }
        ]
      },
      {
        text: '部署：迁移与网络',
        collapsed: false,
        items: [
          { text: '迁移与更换部署方式', link: '/guide/04-migration' },
          { text: '备份与恢复操作', link: '/guide/05-backup' },
          { text: '中国大陆访问与加速', link: '/guide/network/01-cn-access' }
        ]
      },
      {
        text: '功能使用',
        collapsed: false,
        items: [
          { text: 'V2.8.0 新功能速览', link: '/features/00-whats-new' },
          { text: '功能总览', link: '/features/01-feature-overview' },
          { text: '1. 运行总览', link: '/features/02-overview-module' },
          { text: '2. 大型考试', link: '/features/03-major-module' },
          { text: '3. 周测计划', link: '/features/04-weekly-module' },
          { text: '4. 年级与班级', link: '/features/05-classes-module' },
          { text: '5. 设备管理', link: '/features/06-devices-module' },
          { text: '6. 用户与权限', link: '/features/07-users-module' },
          { text: '创建一场大型考试', link: '/features/08-create-major-exam' },
          { text: '创建一场周测', link: '/features/09-create-weekly-test' },
          { text: '其他功能', link: '/features/10-other-features' },
          { text: '数据同步与离线行为', link: '/features/11-data-sync' },
          { text: '管理设备与绑定', link: '/features/12-manage-devices' },
          { text: '管理账号与角色', link: '/features/13-manage-accounts' },
          { text: '维护年级与班级', link: '/features/14-manage-classes' },
          { text: '提醒设置', link: '/features/15-notifications' },
          { text: '公告与使用文档', link: '/features/16-announcements' }
        ]
      },
      {
        text: '管理员手册',
        collapsed: false,
        items: [
          { text: '手册说明', link: '/admin/' },
          { text: '1. 超级管理员', link: '/admin/01-super-admin' },
          { text: '2. 年级管理员', link: '/admin/02-grade-admin' },
          { text: '3. 班级管理员', link: '/admin/03-class-admin' },
          { text: '4. 班级访客', link: '/admin/04-class-guest' },
          { text: '5. 学期切换清单', link: '/admin/05-semester-checklist' },
          { text: '6. 外观、主题与品牌', link: '/admin/06-theme' },
          { text: '7. 教室设备日常运维', link: '/admin/07-classroom-ops' }
        ]
      },
      {
        text: '常见问题',
        collapsed: false,
        items: [
          { text: '常见问题速查', link: '/faq/' },
          { text: '快问快答', link: '/faq/00-quick-answers' },
          { text: '账号与权限', link: '/faq/01-accounts' },
          { text: '考试与周测', link: '/faq/02-exams' },
          { text: '设备与大屏', link: '/faq/03-devices' },
          { text: '部署与更新', link: '/faq/04-deploy' },
          { text: '数据与备份', link: '/faq/05-data' }
        ]
      },
      {
        text: '集成与 API',
        collapsed: false,
        items: [
          { text: '集成总览', link: '/integrations/' },
          { text: '1. 插件总览', link: '/integrations/classisland/01-overview' },
          { text: '2. 配对与设备绑定', link: '/integrations/classisland/02-pairing' },
          { text: '3. 接口与兼容', link: '/integrations/classisland/03-api' },
          { text: '4. 插件常见问题', link: '/integrations/classisland/04-faq' },
          { text: '考试数据接口', link: '/integrations/02-api' }
        ]
      },
      {
        text: '场景演练',
        collapsed: false,
        items: [
          { text: '演练总览', link: '/playbooks/' },
          { text: '1. 第一次全校上线', link: '/playbooks/01-go-live' },
          { text: '2. 考试当天', link: '/playbooks/02-exam-day' },
          { text: '3. 假期与开学', link: '/playbooks/03-holiday' }
        ]
      },
      {
        text: '附录',
        collapsed: false,
        items: [
          { text: 'A. 故障排查', link: '/appendix/a-troubleshooting' },
          { text: 'B. 本地开发', link: '/appendix/b-local-development' },
          { text: 'C. ClassIsland 插件', link: '/appendix/c-classisland' },
          { text: 'D. Functions 迁移到新加坡', link: '/appendix/d-singapore-functions' },
          { text: 'E. 版本兼容与升级', link: '/appendix/e-version-compatibility' },
          { text: 'F. 错误信息对照表', link: '/appendix/f-error-reference' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/PikaNova/Novora' }
    ],
    footer: {
      message: 'Novora 部署与维护文档',
      copyright: '内容基于 Novora V2.8.0 整理'
    },
    search: { provider: 'local' }
  }
})
