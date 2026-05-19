# Crimson Guide 实施计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建面向全球玩家的《红色沙漠》(Crimson Desert) 多语言攻略静态网站

**Architecture:** Astro 5.x 静态站点生成器 + React 岛屿架构处理客户端交互。MDX 内容通过 Astro Content Collections 管理，按语言分目录存储。Vercel 部署，CI/CD 自动化。

**Tech Stack:** Astro 5.x, React 19, TailwindCSS 4, MDX, Pagefind, Giscus, Leaflet.js, @vite-pwa/astro-integration, Vercel

---

## Chunk 1: 项目初始化与基础配置

### Task 1: 初始化 Astro 项目

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`

- [ ] **Step 1: 创建 Astro 项目骨架**

```bash
cd E:/LobeHubWork.worktrees/red/_geming
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict
```

- [ ] **Step 2: 安装核心依赖**

```bash
npm install astro @astrojs/react @astrojs/tailwind @astrojs/mdx @astrojs/sitemap react react-dom
```

- [ ] **Step 3: 安装辅助依赖**

```bash
npm install @pagefind/astro giscus react-leaflet leaflet @vite-pwa/astro-integration
```

- [ ] **Step 4: 安装开发依赖**

```bash
npm install -D @types/react @types/react-dom @types/leaflet prettier prettier-plugin-astro
```

- [ ] **Step 5: 验证项目能正常启动**

```bash
npm run dev
```

Expected: Astro dev server 启动，localhost:4321 可访问

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: init astro project with dependencies"
```

---

### Task 2: 配置 Astro 多语言与基础设置

**Files:**
- Modify: `astro.config.mjs`
- Create: `src/i18n/ui.ts`, `src/i18n/utils.ts`

- [ ] **Step 1: 创建 UI 翻译字典 `src/i18n/ui.ts`**

定义 `languages` 对象（en, zh-cn, ja, ko, es, pt）、`defaultLang = 'en'`、`Lang` 类型。
定义 `translations` 对象，每种语言包含所有 UI 界面文字（nav.*, hero.*, section.*, category.*, footer.*, search.*, guide.*）。
导出 `getTranslations(lang)` 和 `useTranslatedPath(lang)` 函数。

- [ ] **Step 2: 创建 i18n 工具函数 `src/i18n/utils.ts`**

- `getLangFromUrl(url)`: 从 URL 路径提取语言代码
- `getPathWithoutLocale(pathname)`: 去掉路径中的语言前缀

- [ ] **Step 3: 配置 `astro.config.mjs`**

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://crimsonsguide.com',
  output: 'static',
  integrations: [react(), tailwind(), mdx(), sitemap({
    i18n: {
      defaultLocale: 'en',
      locales: { en: 'en', 'zh-cn': 'zh-CN', ja: 'ja', ko: 'ko', es: 'es', pt: 'pt' },
    },
  })],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-cn', 'ja', 'ko', 'es', 'pt'],
    routing: { prefixDefaultLocale: true },
  },
});
```

- [ ] **Step 4: 验证配置无报错**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add i18n config and astro setup"
```

---

### Task 3: TailwindCSS 与全局样式

**Files:**
- Create: `src/styles/global.css`, `tailwind.config.mjs`

- [ ] **Step 1: 创建 TailwindCSS 配置**

- `darkMode: 'class'`
- 自定义颜色：`primary`（红色系，呼应游戏主题）和 `surface`（灰蓝色系，UI 背景/文字）
- 字体：Inter（主字体）、JetBrains Mono（代码）

- [ ] **Step 2: 创建全局样式 `src/styles/global.css`**

- Tailwind 基础指令
- Body 默认白底/暗色黑底
- `.prose` 类：攻略文章内容排版样式（标题、段落、列表、表格、引用、图片）

- [ ] **Step 3: 验证样式生效**

修改 `src/pages/index.astro` 引入 global.css，测试 Tailwind 类

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add tailwind config and global styles"
```

---

### Task 4: Content Collections Schema

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/en/guides/beginners/getting-started.mdx`
- Create: `src/content/zh-cn/guides/beginners/getting-started.mdx`
- Create: `src/content/{ja,ko,es,pt}/guides/beginners/.gitkeep`

- [ ] **Step 1: 定义 Content Collections schema `src/content/config.ts`**

字段：title, description, category (enum 8类), tags, difficulty, author, publishDate, updateDate, coverImage, order, relatedGuides

- [ ] **Step 2: 创建英文和中文示例 MDX 攻略文章**

每个包含完整 frontmatter + 示例内容（新手入门指南）

- [ ] **Step 3: 创建其余语言目录（ja/ko/es/pt 各放 .gitkeep）**

- [ ] **Step 4: 验证 Content Collections 无 schema 错误**

```bash
npm run dev
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add content collections schema and sample mdx"
```

---

## Chunk 2: 布局与核心组件

### Task 5: 基础 Layout 组件

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/common/Header.astro`
- Create: `src/components/common/Footer.astro`
- Create: `src/components/common/LanguageSwitcher.astro`
- Create: `src/components/common/ThemeToggle.tsx`
- Create: `src/pages/index.astro`（重定向到 /en）
- Create: `src/pages/[lang]/index.astro`（首页）

- [ ] **Step 1: 创建 BaseLayout**

完整的 HTML 模板，包含：meta 标签、OG 标签、canonical、Google Fonts (Inter)、主题初始化脚本（localStorage + prefers-color-scheme）、Header + Footer 插槽

- [ ] **Step 2: 创建 Header**

固定顶部导航栏（sticky + backdrop-blur），包含：Logo、桌面端导航链接（Guides/Map/News/About）、LanguageSwitcher、ThemeToggle

- [ ] **Step 3: 创建 Footer**

三栏布局：品牌信息 + 免责声明 | 攻略快捷链接 | 外部资源链接

- [ ] **Step 4: 创建 LanguageSwitcher**

下拉菜单，hover 显示所有 6 种语言选项，当前语言高亮，点击跳转对应语言同路径

- [ ] **Step 5: 创建 ThemeToggle (React)**

亮/暗切换按钮，使用 `document.documentElement.classList` 切换 `dark` 类，持久化到 localStorage

- [ ] **Step 6: 创建根页面重定向**

`src/pages/index.astro` → `return Astro.redirect('/en')`

- [ ] **Step 7: 创建多语言首页 `src/pages/[lang]/index.astro`**

`getStaticPaths` 生成 6 语言页面。Hero Banner + 分类入口 Grid (8类)。使用 BaseLayout。

- [ ] **Step 8: 验证首页渲染**

```bash
npm run dev
```

测试：`/` → 重定向到 `/en`，`/zh-cn` → 中文首页，导航、语言切换、暗色切换正常

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat: add base layout, header, footer, language switcher and theme toggle"
```

---

## Chunk 3: 攻略页面系统

### Task 6: 攻略列表页与分类路由

**Files:**
- Create: `src/components/guide/GuideCard.astro`
- Create: `src/pages/[lang]/guides/index.astro`
- Create: `src/pages/[lang]/guides/[category]/index.astro`

- [ ] **Step 1: 创建 GuideCard 攻略卡片组件**

封面图（aspect-video）、分类标签、日期、标题、描述（2行截断）、标签（最多3个）

- [ ] **Step 2: 创建攻略列表页**

获取当前语言所有攻略，按发布日期倒序排列。顶部分类 Tab 筛选（All + 8类）。3列网格展示攻略卡片。

- [ ] **Step 3: 创建分类筛选页**

`getStaticPaths` 为每种语言 × 每个分类生成页面。当前分类 Tab 高亮（primary-600 白字）。同分类攻略按 order + date 排序。

- [ ] **Step 4: 验证攻略列表页**

```bash
npm run dev
```

访问 `/en/guides` 和 `/en/guides/beginners`，确认渲染正常

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add guide listing pages with category filter"
```

---

### Task 7: 攻略文章详情页（含 TOC + 阅读进度条）

**Files:**
- Create: `src/pages/[lang]/guides/[...slug].astro`
- Create: `src/components/guide/TableOfContents.tsx`
- Create: `src/components/guide/ReadingProgress.tsx`

- [ ] **Step 1: 创建阅读进度条 `ReadingProgress.tsx`**

固定在 Header 下方的细条（h-1），根据 scroll 位置计算百分比宽度，primary-500 配色

- [ ] **Step 2: 创建目录组件 `TableOfContents.tsx`**

从 `.prose` 区域提取 h2/h3 标题，`IntersectionObserver` 监测高亮位置，嵌套缩进显示

- [ ] **Step 3: 创建攻略文章详情页**

三栏布局：左侧侧边栏（TOC + 标签）| 中间文章内容（prose）| （TOC 在左侧完成）
Header 区域：分类 + 难度标签、标题、描述、作者 + 日期
使用 `getStaticPaths` 为所有语言 × 所有攻略 slug 生成页面

- [ ] **Step 4: 验证文章页**

访问 `/en/guides/beginners/getting-started` 和 `/zh-cn/guides/beginners/getting-started`
确认：内容渲染、目录高亮、进度条滚动正常

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add guide detail page with TOC and reading progress"
```

---

## Chunk 4: 自定义 MDX 组件

### Task 8: 攻略专用 MDX 组件

**Files:**
- Create: `src/components/mdx/Callout.astro`
- Create: `src/components/mdx/GuideTable.astro`
- Create: `src/components/mdx/ItemImage.astro`
- Create: `src/components/mdx/VideoEmbed.tsx`

- [ ] **Step 1: 创建 Callout 组件**

4 种类型：tip(绿)/warning(黄)/important(红)/info(蓝)。左边框 + 图标 + 内容插槽。

- [ ] **Step 2: 创建 GuideTable 组件**

包裹 `<table>` 的容器，overflow-x-auto 响应式水平滚动

- [ ] **Step 3: 创建 ItemImage 组件**

`<figure>` + `<img>` + 可选 `<figcaption>`，带圆角阴影和懒加载

- [ ] **Step 4: 创建 VideoEmbed (React)**

支持 YouTube（`youtube.com/watch?v=` / `youtu.be/`）和 Bilibili（`bilibili.com/video/BV`）链接自动解析为 embed URL。aspect-video 容器 + iframe。

- [ ] **Step 5: 验证所有 MDX 组件**

在示例 MDX 文件中使用所有组件，`npm run dev` 确认渲染无误

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add custom MDX components"
```

---

## Chunk 5: 搜索、评论与互动地图

### Task 9: Pagefind 全站搜索

**Files:**
- Modify: `astro.config.mjs` (添加 pagefind 集成)
- Create: `src/components/common/SearchDialog.tsx`
- Modify: `src/components/common/Header.astro` (添加搜索按钮)

- [ ] **Step 1: 安装和配置 Pagefind**

```bash
npm install @pagefind/astro
```

在 `astro.config.mjs` 的 integrations 中添加 `pagefind()`

- [ ] **Step 2: 创建搜索对话框 `SearchDialog.tsx`**

- `Ctrl+K` / `Cmd+K` 快捷键唤起
- 全屏遮罩 + 居中对话框
- 输入框自动聚焦
- 调用 `window.pagefind.search()` 实时搜索
- 结果列表：标题 + 摘要，最多 8 条
- `ESC` 关闭

- [ ] **Step 3: 在 Header 中集成搜索按钮**

导航栏中添加搜索图标按钮，点击触发 SearchDialog。`client:load` 加载。

- [ ] **Step 4: 构建测试 Pagefind 索引**

```bash
npm run build
```

验证 `dist/pagefind/` 目录生成

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add full-text search with pagefind"
```

---

### Task 10: Giscus 评论系统

**Files:**
- Create: `src/components/comments/GiscusComments.tsx`
- Modify: `src/pages/[lang]/guides/[...slug].astro` (添加评论区)

- [ ] **Step 1: 创建 Giscus 评论组件**

创建 `src/components/comments/GiscusComments.tsx`：
- 使用 `giscus` npm 包
- 配置：repo, repoId, category, categoryId, mapping（按 pathname）
- 根据页面 lang 属性设置 `lang` 参数
- `theme` 根据 `document.documentElement.classList.contains('dark')` 动态切换
- 监听主题变化事件，切换 Giscus 主题

- [ ] **Step 2: 在文章详情页集成评论区**

在 `src/pages/[lang]/guides/[...slug].astro` 文章内容下方添加 `<GiscusComments client:visible />`（仅在进入视口时加载）

- [ ] **Step 3: 验证评论渲染**

构建后在浏览器中确认评论区加载（需要配置 GitHub repo 的 Discussions）

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add giscus comments system"
```

---

### Task 11: Leaflet 互动地图

**Files:**
- Create: `src/pages/[lang]/map.astro`
- Create: `src/components/map/InteractiveMap.tsx`
- Create: `src/data/map-markers.json`

- [ ] **Step 1: 创建地图标记数据格式**

创建 `src/data/map-markers.json`，定义标记数据结构：
```json
{
  "markers": [
    {
      "id": "boss-1",
      "name": "Desert Guardian",
      "type": "boss",
      "lat": 0.5,
      "lng": 0.3,
      "description": "World boss in the northern wasteland",
      "guide": "bosses/desert-guardian"
    }
  ],
  "layers": ["collectibles", "bosses", "mounts", "quests", "teleports"]
}
```

- [ ] **Step 2: 创建 InteractiveMap 组件**

创建 `src/components/map/InteractiveMap.tsx`：
- Leaflet 地图，游戏地图截图作为瓦片层（初始用占位瓦片）
- 标记点按图层分组（LayerGroup）
- 图层切换控件
- 点击标记弹出 Popup：名称 + 描述 + 跳转攻略链接
- 需要导入 Leaflet CSS

- [ ] **Step 3: 创建地图页面**

创建 `src/pages/[lang]/map.astro`：
- 使用 BaseLayout
- 标题 + 说明文字
- `<InteractiveMap client:load />` 全宽展示
- `getStaticPaths` 生成 6 语言页面

- [ ] **Step 4: 验证地图渲染**

```bash
npm run dev
```

访问 `/en/map`，确认地图加载、标记点显示、图层切换正常

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add interactive map with leaflet"
```

---

## Chunk 6: PWA、新闻页与收尾

### Task 12: PWA 支持

**Files:**
- Modify: `astro.config.mjs` (添加 VitePWA 集成)
- Create: `public/manifest.json`（或在配置中生成）

- [ ] **Step 1: 配置 @vite-pwa/astro-integration**

在 `astro.config.mjs` 中添加 VitePWA 集成：
- `name`: "Crimson Guide"
- `short_name`: "CrimsonGuide"
- `theme_color`: primary-600 (#dc2626)
- `background_color`: white
- `display`: standalone
- 缓存策略：静态资源 Cache First，HTML Stale While Revalidate

- [ ] **Step 2: 添加 PWA 图标**

创建 `public/icons/` 目录，放入 192x192 和 512x512 的 PWA 图标（初始可用占位图）

- [ ] **Step 3: 验证 PWA 注册**

```bash
npm run build
```

检查 `dist/` 中生成 `sw.js`（Service Worker）和 manifest

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add PWA support"
```

---

### Task 13: 新闻页面

**Files:**
- Create: `src/pages/[lang]/news/index.astro`
- Create: `src/pages/[lang]/news/[...slug].astro`
- Create: 示例新闻 MDX 文件

- [ ] **Step 1: 添加 news 类型到 Content Collections**

在 `src/content/config.ts` 中可复用 guides collection（category 包含 'news'），或新增独立的 news collection。

- [ ] **Step 2: 创建示例新闻 MDX**

创建 `src/content/en/news/release-date-confirmed.mdx` 和中文版本

- [ ] **Step 3: 创建新闻列表页**

与攻略列表页结构类似，但只显示 category=news 的内容。按日期倒序。

- [ ] **Step 4: 创建新闻详情页**

可与攻略详情页共享同一组件/页面（通过 `[...slug]` 路由已覆盖）

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add news listing and detail pages"
```

---

### Task 14: About 页面与 SEO 收尾

**Files:**
- Create: `src/pages/[lang]/about.astro`
- Modify: `src/layouts/BaseLayout.astro` (添加 SEO 增强)

- [ ] **Step 1: 创建 About 页面**

`src/pages/[lang]/about.astro`：项目介绍、免责声明（非官方、粉丝制作）、贡献指南、联系方式。6 语言 `getStaticPaths`。使用 BaseLayout。

- [ ] **Step 2: 添加 hreflang 标签**

在 BaseLayout `<head>` 中循环输出所有语言的 `<link rel="alternate" hreflang="..." href="...">`

- [ ] **Step 3: 添加 JSON-LD 结构化数据**

在攻略文章页 `<head>` 中添加 `Article` schema 的 JSON-LD script 标签

- [ ] **Step 4: 生成 RSS Feed**

在 `src/pages/[lang]/rss.xml.ts` 使用 `getCollection` 生成各语言的 RSS feed

- [ ] **Step 5: 验证构建**

```bash
npm run build
```

确认静态输出完整、无报错、所有语言路由正确生成

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add about page, SEO tags and RSS feeds"
```

---

### Task 15: Vercel 部署配置

**Files:**
- Create: `vercel.json`
- Modify: `package.json` (添加 build 脚本)

- [ ] **Step 1: 创建 Vercel 配置**

创建 `vercel.json`：
```json
{
  "framework": "astro",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

- [ ] **Step 2: 确认 package.json 脚本正确**

- `"dev": "astro dev"`
- `"build": "astro build"`
- `"preview": "astro preview"`

- [ ] **Step 3: 完整构建验证**

```bash
npm run build && npm run preview
```

确认所有页面正确生成，404 页面存在

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add vercel deployment config"
```

---

## 执行顺序总结

| Chunk | 内容 | 预估任务数 | 依赖 |
|-------|------|-----------|------|
| 1 | 项目初始化 + i18n + 样式 + Schema | 4 Tasks | 无 |
| 2 | Layout + Header/Footer/主题/语言切换 | 1 Task | Chunk 1 |
| 3 | 攻略列表 + 分类 + 文章详情页 + TOC | 2 Tasks | Chunk 2 |
| 4 | 自定义 MDX 组件 | 1 Task | Chunk 3 |
| 5 | 搜索 + 评论 + 互动地图 | 3 Tasks | Chunk 3 |
| 6 | PWA + 新闻 + About + SEO + 部署 | 4 Tasks | Chunk 5 |

总计 **15 个 Task**，建议使用 subagent-driven-development 并行执行同 Chunk 内的独立 Task。
