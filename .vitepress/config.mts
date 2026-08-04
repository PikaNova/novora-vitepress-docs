import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Novora 部署文档',
  description: 'Novora 从零部署、功能使用与维护指南（更新日志覆盖至 V2.7.1）',
  cleanUrls: true,
  lastUpdated: true,
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
      { text: '效果预览', link: '/effect/01-index' },
      { text: '从零部署', link: '/guide/01-introduction' },
      { text: '功能使用', link: '/features/01-feature-overview' },
      { text: '故障排查', link: '/appendix/a-troubleshooting' },
      { text: '更新日志', link: '/changelog' },
      { text: '项目仓库', link: 'https://github.com/PikaNova/Novora' }
    ],
    sidebar: [
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
          { text: '11. ClassIsland', link: '/effect/11-classisland' }
        ]
      },
      {
        text: '更新日志',
        collapsed: false,
        items: [
          { text: '更新日志', link: '/changelog' },
          { text: 'V2.7.1（main 最新）', link: '/changelog/v2.7.1' },
          { text: 'V2.7.0', link: '/changelog/v2.7.0' },
          { text: 'V2.6.2', link: '/changelog/v2.6.2' },
          { text: 'V2.6.1', link: '/changelog/v2.6.1' },
          { text: 'V2.6.0', link: '/changelog/v2.6.0' }
        ]
      },
      {
        text: '部署主线',
        collapsed: false,
        items: [
          { text: '1. 项目介绍', link: '/guide/01-introduction' },
          { text: '2. 部署原理', link: '/guide/02-architecture' },
          { text: '3. 部署前准备', link: '/guide/03-prerequisites' },
          { text: '4. 获取项目源码', link: '/guide/04-source-code' },
          { text: '5. 创建 Neon 数据库', link: '/guide/05-neon' },
          { text: '6. 配置 Vercel 项目', link: '/guide/06-vercel' },
          { text: '7. 配置环境变量', link: '/guide/07-environment' },
          { text: '8. 执行首次部署', link: '/guide/08-first-deploy' },
          { text: '9. 首次登录和初始化', link: '/guide/09-initialization' },
          { text: '10. 部署验收', link: '/guide/10-acceptance' },
          { text: '11. 正式上线', link: '/guide/11-production' },
          { text: '12. 日常维护', link: '/guide/12-maintenance' }
        ]
      },
      {
        text: '功能使用',
        collapsed: false,
        items: [
          { text: '功能总览', link: '/features/01-feature-overview' },
          { text: '1. 运行总览', link: '/features/02-overview-module' },
          { text: '2. 大型考试', link: '/features/03-major-module' },
          { text: '3. 周测计划', link: '/features/04-weekly-module' },
          { text: '4. 年级与班级', link: '/features/05-classes-module' },
          { text: '5. 设备管理', link: '/features/06-devices-module' },
          { text: '6. 用户与权限', link: '/features/07-users-module' },
          { text: '创建一场大型考试', link: '/features/08-create-major-exam' },
          { text: '创建一场周测', link: '/features/09-create-weekly-test' },
          { text: '其他功能', link: '/features/10-other-features' }
        ]
      },
      {
        text: '附录',
        collapsed: false,
        items: [
          { text: 'A. 故障排查', link: '/appendix/a-troubleshooting' },
          { text: 'B. 本地开发', link: '/appendix/b-local-development' },
          { text: 'C. ClassIsland 插件', link: '/appendix/c-classisland' },
          { text: 'D. 本地部署', link: '/appendix/e-local-deployment' },
          { text: 'E. Functions 迁移到新加坡', link: '/appendix/f-singapore-functions' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/PikaNova/Novora' }
    ],
    footer: {
      message: 'Novora 部署与维护文档',
      copyright: '内容基于 Novora V2.5.6 整理，更新日志覆盖至 V2.7.1'
    },
    search: { provider: 'local' }
  }
})
