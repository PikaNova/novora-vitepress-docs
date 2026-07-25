# Novora VitePress 文档

这是一套可独立运行的 VitePress 文档站，包含 12 篇主体文档和 5 篇附录，内容面向第一次部署 Novora 的零基础用户。

## 本地运行

```bash
npm install
npm run docs:dev
```

浏览器打开终端显示的本地地址，默认通常为 `http://localhost:5173`。

## 生产构建

```bash
npm run docs:build
```

构建结果位于 `.vitepress/dist`。如需本地检查构建结果：

```bash
npm run docs:preview
```

## 导入现有 VitePress

如果已有文档站，可合并 `guide`、`appendix` 和 `public` 目录，再把 `.vitepress/config.mts` 中的导航及侧边栏项目合并到现有配置。不要直接覆盖已有配置。
