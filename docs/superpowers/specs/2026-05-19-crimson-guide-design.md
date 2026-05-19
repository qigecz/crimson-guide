# 《红色沙漠》全球攻略站 - 设计文档

> **项目代号**: Crimson Guide  
> **创建日期**: 2026-05-19  
> **目标**: 为全球玩家提供《红色沙漠》(Crimson Desert) 的全面攻略内容的静态网站

---

## 1. 项目概述

### 1.1 目标受众
全球《红色沙漠》玩家，支持中/英/日/韩 + 西/葡 6 种语言。

### 1.2 内容板块（8 大板块）
1. 主线剧情通关流程
2. 装备/武器系统 — 装备推荐、配装指南
3. 技能系统 — 技能树解析、优先解锁推荐
4. 地图探索 — 收集品、隐藏地点、宝箱
5. 坐骑/驯马系统 — 野外坐骑位置与驯服方法
6. BOSS 战攻略 — 各 BOSS 打法与弱点
7. 新手入门指南 — 开荒建议
8. 游戏新闻/更新日志 — 版本更新、活动资讯

---

## 2. 技术栈

| 类别 | 选择 |
|------|------|
| 框架 | Astro 5.x (静态模式 SSG) |
| UI 交互 | React (岛屿架构，用于地图/评论等) |
| 样式 | TailwindCSS |
| 内容 | MDX + Astro Content Collections |
| 搜索 | Pagefind |
| 评论 | Giscus (GitHub Discussions) |
| 互动地图 | Leaflet.js |
| PWA | @vite-pwa/astro-integration |
| 部署 | Vercel (关联 GitHub main 分支) |
| 版本管理 | Git |

---

## 3. 项目架构

```
src/
├── content/           # MDX 攻略内容 (按语言分目录)
│   ├── zh-cn/guides/  # 中文攻略
│   ├── en/guides/     # 英文攻略
│   ├── ja/guides/     # 日文攻略
│   ├── ko/guides/     # 韩文攻略
│   ├── es/guides/     # 西班牙语攻略
│   └── pt/guides/     # 葡萄牙语攻略
├── i18n/              # UI 翻译字典
├── components/        # UI 组件
│   ├── common/        # 通用：导航、页脚、搜索等
│   ├── guide/         # 攻略专用：TOC、进度条
│   ├── map/           # 互动地图组件 (React)
│   └── comments/      # 评论系统 (React)
├── layouts/           # 页面布局模板
├── pages/             # 路由页面 (Astro 自动生成)
├── styles/            # 全局样式 + TailwindCSS
└── assets/            # 图片、图标等静态资源
```

---

## 4. 页面路由结构

```
/[locale]/                              # 首页
/[locale]/guides/                       # 攻略列表页
/[locale]/guides/story/                 # 主线剧情
/[locale]/guides/equipment/             # 装备系统
/[locale]/guides/skills/                # 技能系统
/[locale]/guides/exploration/           # 地图探索
/[locale]/guides/mounts/                # 坐骑/驯马
/[locale]/guides/bosses/                # BOSS 战
/[locale]/guides/beginners/             # 新手入门
/[locale]/guides/[slug]/                # 具体攻略文章
/[locale]/map/                          # 互动地图
/[locale]/news/                         # 游戏新闻
/[locale]/news/[slug]/                  # 具体新闻
/[locale]/about/                        # 关于
```

默认路由约定：
- 默认语言：英文 (`en`)
- `/` 重定向到 `/en/`
- 每种语言独立生成静态目录

---

## 5. 首页布局

```
┌──────────────────────────────────────────┐
│  Logo  │ 导航菜单 │ 语言切换 🌐 │  🌙/☀️  │
├──────────────────────────────────────────┤
│           Hero Banner 区域               │
│   《红色沙漠》全球攻略站 - 标语           │
│         [浏览全部攻略] [互动地图]          │
├──────────────────────────────────────────┤
│  🔥 热门攻略         │  📰 最新动态       │
│  ┌─────────────────┐ │  BOSS 攻略更新... │
│  │ 卡片1  卡片2     │ │  新手指南发布... │
│  │ 卡片3  卡片4     │ │  装备推荐更新... │
│  └─────────────────┘ │                   │
├──────────────────────────────────────────┤
│  🎮 攻略分类入口 (8大板块 Icon Grid)      │
│  [主线] [装备] [技能] [探索]              │
│  [坐骑] [BOSS] [新手] [新闻]              │
├──────────────────────────────────────────┤
│              页脚                         │
└──────────────────────────────────────────┘
```

**攻略文章页布局：**

```
┌──────────────────────────────────────────┐
│  导航栏                                   │
├────────┬─────────────────────┬───────────┤
│        │                     │           │
│  攻略   │   文章内容 (MDX)    │  侧边目录  │
│  分类   │   阅读进度条 🔵     │  快速跳转  │
│  导航   │                     │  标签列表  │
│        │   💬 评论区          │           │
│        │                     │           │
├────────┴─────────────────────┴───────────┤
│  页脚                                     │
└──────────────────────────────────────────┘
```

---

## 6. 内容管理 (MDX + Content Collections)

### 6.1 Content Schema

```typescript
// src/content/config.ts
const guideCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum([
      'story', 'equipment', 'skills',
      'exploration', 'mounts', 'bosses',
      'beginners', 'news'
    ]),
    tags: z.array(z.string()),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    author: z.string().default('Crimson Guide Team'),
    publishDate: z.date(),
    updateDate: z.date().optional(),
    coverImage: z.string().optional(),
    order: z.number().default(0),
    relatedGuides: z.array(z.string()).optional(),
  }),
});
```

### 6.2 多语言文件组织

每种语言独立的目录结构，内容结构一致：

```
src/content/{locale}/guides/
├── story/        # 主线剧情（按章节编号）
├── equipment/    # 装备攻略
├── skills/       # 技能攻略
├── exploration/  # 地图探索
├── mounts/       # 坐骑系统
├── bosses/       # BOSS 攻略
├── beginners/    # 新手指南
└── news/         # 新闻更新
```

### 6.3 自定义 MDX 组件

| 组件 | 用途 |
|------|------|
| `<Callout>` | 提示框（tip/warning/important） |
| `<GuideTable>` | 格式化数据表格（BOSS 数据、装备属性对比） |
| `<ItemImage>` | 带标题的游戏物品图片 |
| `<VideoEmbed>` | 嵌入攻略视频（YouTube/Bilibili） |
| `<InteractiveMap>` | 互动地图标记点 |

---

## 7. 功能特性实现方案

### 7.1 🌙 暗/亮主题切换
- TailwindCSS `darkMode: 'class'` 策略
- `<ThemeToggle />` React 组件，偏好存 `localStorage`，默认跟随系统

### 7.2 🔍 全站搜索
- Pagefind 专为静态站设计，构建后自动索引 MDX 内容
- 每种语言独立索引，切换语言时搜索对应索引
- 搜索框固定导航栏，支持 `Ctrl+K` 快捷键

### 7.3 💬 评论系统
- Giscus（基于 GitHub Discussions，免费无广告）
- 支持 6 语言 UI 本地化
- React 岛屿组件延迟渲染，不影响首屏

### 7.4 📱 PWA 支持
- `@vite-pwa/astro-integration`
- 静态资源 Cache First，MDX 页面 Stale While Revalidate
- 支持添加到主屏幕，离线阅读已缓存攻略

### 7.5 📊 互动地图
- Leaflet.js React 岛屿组件
- 游戏地图截图切片作为瓦片
- 分层标注：收集品、BOSS、坐骑、任务、传送点
- 点击标记弹出信息 + 跳转攻略文章

### 7.6 🏷️ 标签/分类筛选
- 攻略列表页分类 Tab（8 大板块）
- 侧边栏标签云（从 tags 自动聚合）
- 分类 + 标签组合筛选，URL 驱动：`/guides/?category=bosses&tags=rank-1`

### 7.7 📖 阅读进度 / 目录导航
- 顶部阅读进度条，随滚动更新
- 侧边 TOC 从 MDX 标题层级自动生成，滚动高亮
- `IntersectionObserver` 实现，React 岛屿组件

---

## 8. 部署与 SEO

### 8.1 部署
- Vercel 关联 GitHub 仓库，`main` 分支自动部署
- 子目录多语言路由（SEO 权重集中同域）
- PR 自动预览部署

### 8.2 SEO 策略

| 策略 | 实现 |
|------|------|
| 多语言 hreflang | 每页自动生成 6 语言 `<link rel="alternate">` |
| 结构化数据 | `Article` + `HowTo` Schema |
| Open Graph | 每页独立 OG 标题/描述/封面 |
| Sitemap | 多语言 sitemap.xml 自动生成 |
| RSS Feed | 每种语言独立 RSS |
| Meta Description | 自动从 frontmatter 生成 |

### 8.3 CI/CD 工作流

```
内容写手分支 → 提交 MDX → CI 检查：
  ✓ MDX frontmatter schema 校验
  ✓ 翻译完整性检查
  ✓ 图片资源引用验证
  ✓ Pagefind 索引构建测试
→ Vercel 预览部署 → 人工 Review → 合并 → 自动上线
```

### 8.4 性能目标

| 指标 | 目标 |
|------|------|
| Lighthouse Performance | ≥ 95 |
| LCP | < 1.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| 首页总包大小 | < 300KB (不含图片) |

---

## 9. 视觉风格

简洁现代风 — 白色/浅色为主、清爽排版，类似 IGN / GameSpot 风格，阅读体验优先。

---

## 10. 域名策略

推荐子目录方案：
```
crimsonsguide.com/en/...
crimsonsguide.com/zh-cn/...
crimsonsguide.com/ja/...
crimsonsguide.com/ko/...
crimsonsguide.com/es/...
crimsonsguide.com/pt/...
```
同域，SEO 权重集中。
