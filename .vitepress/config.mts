import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Novora 部署文档',
  description: '面向零基础用户的 Novora 部署、初始化与维护指南',
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
      { text: '从零部署', link: '/guide/01-introduction' },
      { text: '故障排查', link: '/appendix/a-troubleshooting' },
      { text: '项目仓库', link: 'https://github.com/PikaNova/Novora' }
    ],
    sidebar: [
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
        text: '附录',
        collapsed: false,
        items: [
          { text: 'A. 故障排查', link: '/appendix/a-troubleshooting' },
          { text: 'B. 本地开发', link: '/appendix/b-local-development' },
          { text: 'C. ClassIsland 插件', link: '/appendix/c-classisland' },
          { text: 'D. 作者遥测后台', link: '/appendix/d-telemetry' },
          { text: 'E. 本地部署', link: '/appendix/e-local-deployment' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/PikaNova/Novora' }
    ],
    footer: {
      message: 'Novora 部署与维护文档',
      copyright: '内容基于 Novora V2.4.1 整理'
    },
    search: { provider: 'local' }
  }
})
