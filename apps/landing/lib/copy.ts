export const en = {
  nav: {
    brand: 'Startup',
    surfaces: 'Surfaces',
    structure: 'Structure',
    ship: 'Ship',
    langToggle: 'Switch to Chinese',
    themeToDark: 'Switch to dark mode',
    themeToLight: 'Switch to light mode',
    quickstart: 'Quickstart',
  },
  hero: {
    eyebrow: 'Monorepo starter',
    title: 'One repo ships the site, the desktop app,',
    titleAccent: 'and the API.',
    ledeLead: 'A batteries-included full-stack starter from',
    ledeAuthor: 'erlinerd',
    ledeTail: '. Wired up, gated by CI, ready on day zero.',
    secondaryCta: 'See what ships',
  },
  cta: {
    useTemplate: 'Use this template',
    heading: 'Clone it today, ship your own product next week.',
  },
  probe: {
    caption:
      'A real request to this deployment. Hono runs inside the Next.js app, no separate server to keep alive.',
    empty: 'empty response',
    requestFailed: 'request failed',
    failLine: 'x request failed (check the Worker is live)',
    okLine: '200 in {ms} ms, served by this Worker',
  },
  quickstart: {
    heading: 'Day zero',
    body: 'Apps talk to packages through workspace protocols. Nothing is duplicated across the tree, and each app runs on its own port.',
    note: 'Runs with Node 22 and pnpm 9. The whole stack builds and tests with zero secrets: env keys are optional and validated lazily.',
    copy: 'copy',
    copied: 'copied',
    copyLabel: 'Copy command: {cmd}',
  },
  surfaces: {
    heading: 'Three apps, one install',
    landing: {
      tech: 'Next.js 16 · App Router',
      body: 'Shipping-ready site with Tailwind v4, Hono mounted at /api/*, and react-hook-form + zod.',
    },
    desktop: {
      tech: 'Vite 8 · Electron',
      body: 'React 19 + Router 8, macOS / Windows / Linux builds, electron-updater wired.',
    },
    server: {
      tech: 'Hono · Node.js',
      body: 'Vercel AI SDK streaming, Drizzle + LibSQL, lazy env, zero secrets.',
    },
  },
  shared: {
    ui: {
      body: 'One shadcn/ui registry feeds both surfaces. Raw .tsx source, no build step, design tokens declared once.',
    },
    db: {
      body: 'Drizzle schema, a createDb() factory, and committed migrations. The same tables back the API and the desktop app.',
    },
  },
  tooling: {
    heading: 'The boring parts are already boring',
    group: {
      monorepo: 'Monorepo',
      quality: 'Quality',
      git: 'Git',
      cicd: 'CI/CD',
    },
    pnpm: 'pnpm 9',
    turborepo: 'Turborepo',
    changesets: 'changesets',
    oxlint: 'oxLint',
    prettier: 'Prettier',
    vitest: 'Vitest + coverage',
    husky: 'Husky',
    lintstaged: 'lint-staged',
    commitlint: 'commitlint',
    gha: 'GitHub Actions',
    builds: 'mac/win/linux builds',
    cloudflare: 'Cloudflare Workers',
  },
  ship: {
    heading: 'Push, tag, hold the installers',
    ci: {
      title: 'CI checks every gate',
      body: 'Lint, format, types, tests with coverage thresholds, and the builds for all workspaces. Red CI never reaches main.',
    },
    release: {
      title: 'Releases build themselves',
      body: 'Electron installers for macOS, Windows, and Linux are packaged and attached to the GitHub release. electron-updater keeps them current.',
    },
  },
  deploy: {
    eyebrow: 'This domain',
    heading: 'You are standing on one of the three apps right now.',
    bodyLead: 'This page is',
    bodyMid:
      '. Every push to main rebuilds it through OpenNext and deploys it to a Cloudflare Worker, and',
    bodyTail: 'runs in the same Worker. That is the whole deploy story.',
    hostingLabel: 'Hosting',
    hostingValue: 'Cloudflare Workers',
    adapterLabel: 'Adapter',
    adapterValue: 'OpenNext',
    triggerLabel: 'Trigger',
    triggerValue: 'push to main',
  },
  links: {
    authorHeading: 'From the author',
    authorLine: 'The author writes and builds at erlinerd.com.',
    authorLabel: 'erlinerd.com',
  },
  footer: {
    license: 'MIT License',
  },
  meta: {
    title: 'Startup: one repo ships the site, the desktop app, and the API',
    description:
      'A batteries-included full-stack monorepo starter: Next.js landing site, Vite + Electron desktop app, Hono backend, shared design system, CI gates, and Cloudflare Workers deploys.',
    ogTitle: 'Startup: one repo ships every surface',
    ogDescription:
      'Next.js site, Electron desktop app, Hono API, shared design system. One install, CI-gated, deploy-ready.',
  },
}

export const zh: Copy = {
  nav: {
    brand: 'Startup',
    surfaces: '应用',
    structure: '结构',
    ship: '发布',
    langToggle: '切换到英文',
    themeToDark: '切换到深色',
    themeToLight: '切换到浅色',
    quickstart: '快速开始',
  },
  hero: {
    eyebrow: 'Monorepo 起手模板',
    title: '一个仓库，交付网站、桌面应用，',
    titleAccent: '还有 API。',
    ledeLead: '一套开箱即用的全栈起手模板，来自',
    ledeAuthor: 'erlinerd',
    ledeTail: '。已接好一切，CI 把关，第一天就能上线。',
    secondaryCta: '看看包含什么',
  },
  cta: {
    useTemplate: '使用此模板',
    heading: '今天克隆，下周发布你自己的产品。',
  },
  probe: {
    caption:
      '这是对当前部署的真实请求。Hono 运行在 Next.js 应用内部，不需要单独的服务进程。',
    empty: '空响应',
    requestFailed: '请求失败',
    failLine: 'x 请求失败（请确认 Worker 已上线）',
    okLine: '{ms} ms 内返回 200，由本 Worker 处理',
  },
  quickstart: {
    heading: '开箱即用',
    body: '应用通过 workspace 协议使用 packages。目录树里没有重复代码，每个应用跑在自己的端口上。',
    note: 'Node 22 与 pnpm 9 即可运行。整套技术栈零密钥即可构建和测试：环境变量全部可选，采用惰性校验。',
    copy: '复制',
    copied: '已复制',
    copyLabel: '复制命令：{cmd}',
  },
  surfaces: {
    heading: '三个应用，一次安装',
    landing: {
      tech: 'Next.js 16 · App Router',
      body: '可直接上线的站点：Tailwind v4、Hono 挂载在 /api/*、react-hook-form + zod。',
    },
    desktop: {
      tech: 'Vite 8 · Electron',
      body: 'React 19 + Router 8，产出 macOS / Windows / Linux 安装包，electron-updater 已接入。',
    },
    server: {
      tech: 'Hono · Node.js',
      body: 'Vercel AI SDK 流式输出、Drizzle + LibSQL、惰性环境变量，零密钥。',
    },
  },
  shared: {
    ui: {
      body: '一套 shadcn/ui registry 同时服务两个端。原始 .tsx 源码，无构建步骤，设计令牌只声明一次。',
    },
    db: {
      body: 'Drizzle schema、createDb() 工厂函数和已提交的迁移。同一套表支撑 API 与桌面应用。',
    },
  },
  tooling: {
    heading: '枯燥的部分已经做完',
    group: {
      monorepo: 'Monorepo',
      quality: '质量',
      git: 'Git',
      cicd: 'CI/CD',
    },
    pnpm: 'pnpm 9',
    turborepo: 'Turborepo',
    changesets: 'changesets',
    oxlint: 'oxLint',
    prettier: 'Prettier',
    vitest: 'Vitest + 覆盖率',
    husky: 'Husky',
    lintstaged: 'lint-staged',
    commitlint: 'commitlint',
    gha: 'GitHub Actions',
    builds: 'mac/win/linux 构建',
    cloudflare: 'Cloudflare Workers',
  },
  ship: {
    heading: '推送、打标签，等安装包出炉',
    ci: {
      title: 'CI 检查每一道关卡',
      body: 'Lint、格式化、类型检查、带覆盖率门槛的测试，以及所有 workspace 的构建。CI 不绿，进不了 main。',
    },
    release: {
      title: '发布版本自动构建',
      body: 'macOS、Windows、Linux 的 Electron 安装包会被打包并附加到 GitHub release，electron-updater 负责保持最新。',
    },
  },
  deploy: {
    eyebrow: '当前域名',
    heading: '你此刻访问的，正是三个应用之一。',
    bodyLead: '这个页面就是',
    bodyMid:
      '。每次推送到 main，都会经 OpenNext 重建并部署到 Cloudflare Worker，且',
    bodyTail: '运行在同一个 Worker 里。这就是完整的部署流程。',
    hostingLabel: '托管',
    hostingValue: 'Cloudflare Workers',
    adapterLabel: '适配器',
    adapterValue: 'OpenNext',
    triggerLabel: '触发',
    triggerValue: '推送到 main',
  },
  links: {
    authorHeading: '来自作者',
    authorLine: '作者在 erlinerd.com 写作与构建。',
    authorLabel: 'erlinerd.com',
  },
  footer: {
    license: 'MIT 许可证',
  },
  meta: {
    title: 'Startup：一个仓库，交付网站、桌面应用与 API',
    description:
      '开箱即用的全栈 monorepo 起手模板：Next.js 落地页、Vite + Electron 桌面应用、Hono 后端、共享设计系统、CI 门禁，以及 Cloudflare Workers 部署。',
    ogTitle: 'Startup：一个仓库，交付所有端',
    ogDescription:
      'Next.js 网站、Electron 桌面应用、Hono API、共享设计系统。一次安装，CI 把关，随时可部署。',
  },
}

export type Copy = typeof en
export type Locale = 'en' | 'zh'
