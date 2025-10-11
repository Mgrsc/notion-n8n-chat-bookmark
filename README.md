# 🌲 Notion 书签智能助手

> 轻量、现代、护眼的书签管理系统 - 集成 AI 聊天助手

## ✨ 特性

- 🟢 **护眼绿色主题** - 舒适的绿色配色，长时间使用不疲劳
- 🚀 **超轻量级** - 仅 11 个核心依赖，构建快速
- 💬 **AI 智能助手** - 通过 n8n 集成的 AI 对话功能
- 📚 **Notion 集成** - 无缝嵌入 Notion 书签数据库
- 🔐 **安全认证** - 基于 NextAuth.js 的服务端认证
- 📱 **响应式设计** - 完美适配桌面和移动设备

## 🎯 技术栈

- **框架**: Next.js 15.5 (App Router + Turbopack)
- **前端**: React 19 + TypeScript
- **认证**: NextAuth.js v5
- **状态管理**: Jotai 2.x
- **样式**: Tailwind CSS 3.4
- **部署**: Vercel

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```bash
# 认证配置 (NextAuth Secret)
NEXTAUTH_SECRET=<运行 npm run generate-secret 生成>
NEXTAUTH_URL=http://localhost:3000

# 登录凭据 (明文密码)
AUTH_USERNAME=admin
AUTH_PASSWORD=admin123

# n8n Webhook 配置
N8N_CHAT_WEBHOOK_URL=<你的 n8n webhook 地址>
N8N_CHAT_AUTH_USERNAME=<n8n webhook 用户名>
N8N_CHAT_AUTH_PASSWORD=<n8n webhook 密码>

# Notion 数据库嵌入地址
NEXT_PUBLIC_NOTION_EMBED_URL=<你的 Notion 公开分享链接>
```

### 3. 生成密钥

```bash
npm run generate-secret
```

将生成的密钥复制到 `.env` 的 `NEXTAUTH_SECRET`

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 📦 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── auth/         # NextAuth 认证
│   │   └── chat/         # 聊天 API (n8n 集成)
│   ├── login/            # 登录页面
│   ├── layout.tsx        # 根布局
│   ├── page.tsx          # 首页
│   └── globals.css       # 全局样式
│
├── components/            # React 组件
│   ├── chat/             # 聊天相关组件
│   │   ├── chat-fab.tsx        # 悬浮球按钮
│   │   ├── chat-window.tsx     # 聊天窗口
│   │   ├── chat-message.tsx    # 消息组件
│   │   └── login-modal.tsx     # 登录弹窗
│   └── notion-embed.tsx  # Notion 嵌入组件
│
├── store/                # Jotai 状态管理
│   └── chat.ts          # 聊天状态
│
├── lib/                  # 工具库
│   ├── auth.ts          # NextAuth 配置
│   └── utils.ts         # 工具函数
│
└── types/               # TypeScript 类型
    └── index.ts         # 类型定义
```

## 🎨 主要功能

### 1. Notion 书签浏览
- 公开访问，无需登录
- 美观的嵌入式展示
- 完整的 Notion 功能支持

### 2. AI 聊天助手
- 点击右下角绿色悬浮球
- 首次使用需要登录
- 通过 n8n workflow 连接 AI
- 支持 Markdown 格式消息
- 代码高亮显示

### 3. 智能消息提醒
- 未读消息红点提示
- 打开窗口自动标记已读
- 持久化已读状态

## 🔧 开发命令

```bash
# 开发 (Turbopack)
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# TypeScript 类型检查
npm run type-check

# 代码检查
npm run lint

# 生成 NextAuth Secret
npm run generate-secret
```

## 🌐 部署到 Vercel

### 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

- `NEXTAUTH_SECRET` - NextAuth 密钥
- `NEXTAUTH_URL` - 生产环境 URL
- `AUTH_USERNAME` - 登录用户名
- `AUTH_PASSWORD` - 登录密码
- `N8N_CHAT_WEBHOOK_URL` - n8n webhook 地址
- `N8N_CHAT_AUTH_USERNAME` - n8n 用户名
- `N8N_CHAT_AUTH_PASSWORD` - n8n 密码
- `NEXT_PUBLIC_NOTION_EMBED_URL` - Notion 嵌入 URL

## 📝 n8n Webhook 配置

### 请求格式

```json
{
  "sessionId": "uuid",
  "action": "sendMessage",
  "chatInput": "用户输入的消息"
}
```

### 响应格式

```json
{
  "output": "AI 助手的回复"
}
```

支持的响应字段（按优先级）：`output`, `text`, `message`, `response`

## 🔐 安全说明

- ✅ 服务端认证 (NextAuth.js JWT)
- ✅ API 路由保护
- ✅ 明文密码仅用于演示，生产环境请使用强密码
- ✅ 聊天 API 需要有效的认证 session
- ⚠️ 建议在生产环境中使用环境变量加密

## 🎯 设计理念

### 护眼绿色配色
- **主色**: Emerald (翡翠绿)
- **中间色**: Green (草绿)
- **过渡色**: Teal (青绿)

### 为什么选择绿色？
- 🟢 波长适中，对眼睛友好
- 🟢 心理效果：平静、自然、放松
- 🟢 适合长时间使用
- 🟢 符合知识管理的主题

## 🐛 故障排除

### 无法登录
- 检查 `NEXTAUTH_SECRET` 是否已设置
- 确认用户名和密码正确

### 聊天无响应
- 验证 `N8N_CHAT_WEBHOOK_URL` 可访问
- 检查 n8n workflow 是否已激活
- 确认 n8n webhook 认证信息正确

### Notion 页面不显示
- 确认 `NEXT_PUBLIC_NOTION_EMBED_URL` 正确
- 检查 Notion 页面是否已公开分享


## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [NextAuth.js](https://authjs.dev/)
- [Jotai](https://jotai.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [n8n](https://n8n.io/)
- [Notion](https://notion.so/)

---

**💚 Made with Love & Green 💚**
