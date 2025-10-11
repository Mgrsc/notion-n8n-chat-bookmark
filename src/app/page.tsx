'use client'

import { NotionEmbed } from '@/components/notion-embed'
import { ChatFab } from '@/components/chat/chat-fab'
import { ChatWindow } from '@/components/chat/chat-window'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      {/* Notion 嵌入页面 - 公开访问 */}
      <NotionEmbed />

      {/* 聊天悬浮球 - 点击时检查认证 */}
      <ChatFab />

      {/* 聊天窗口 - 仅登录用户可见 */}
      <ChatWindow />
    </div>
  )
}
