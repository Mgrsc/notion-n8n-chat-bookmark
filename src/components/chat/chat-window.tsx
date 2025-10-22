'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Loader2, LogOut } from 'lucide-react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useSession, signOut } from 'next-auth/react'
import {
  chatOpenAtom,
  messagesAtom,
  isLoadingAtom,
  sendMessageAtom
} from '@/store/chat'
import { ChatMessage } from './chat-message'

export function ChatWindow() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useAtom(chatOpenAtom)
  const messages = useAtomValue(messagesAtom)
  const isLoading = useAtomValue(isLoadingAtom)
  const sendMessage = useSetAtom(sendMessageAtom)

  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    await sendMessage(input)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // 只有打开状态且已认证才显示
  if (!isOpen) return null
  if (status === 'loading') return null
  if (!session || status !== 'authenticated') {
    // 防御性检查：如果未认证但窗口被打开，自动关闭
    setIsOpen(false)
    return null
  }

  return (
    <div
      className="fixed inset-4 md:inset-auto md:bottom-6 md:right-6
        z-50 md:w-96 md:h-[600px]
        bg-white/98 backdrop-blur-xl
        rounded-2xl shadow-2xl
        border border-gray-200/80
        flex flex-col overflow-hidden
        animate-slide-in"
    >
      {/* 头部 */}
      <header
        className="flex items-center justify-between
          px-4 py-3.5
          bg-emerald-50 border-b border-emerald-100"
      >
        <div className="flex items-center gap-2">
          <span
            className="size-2 bg-emerald-500 rounded-full animate-pulse"
            aria-hidden="true"
          />
          <span className="text-emerald-900 font-semibold text-sm">
            书签助手
          </span>
          {session?.user && (
            <span className="text-emerald-700 text-xs font-medium">
              ({session.user.name})
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* 登出 */}
          {session && (
            <button
              onClick={() => signOut()}
              className="text-emerald-700 hover:text-emerald-900
                hover:bg-emerald-100 rounded-lg p-1.5
                transition-colors"
              title="退出登录"
            >
              <LogOut size={18} />
            </button>
          )}

          {/* 关闭 */}
          <button
            onClick={() => setIsOpen(false)}
            className="text-emerald-700 hover:text-emerald-900
              hover:bg-emerald-100 rounded-lg p-1.5
              transition-colors"
            aria-label="关闭聊天"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* 消息列表 */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3
          scrollbar-thin scrollbar-thumb-gray-300
          scrollbar-track-transparent"
      >
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* 加载指示器 */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-2">
              <Loader2
                className="size-5 animate-spin text-gray-400"
                aria-label="加载中"
              />
            </div>
          </div>
        )}
      </div>

      {/* 输入框 */}
      <footer className="p-4 border-t border-gray-100 bg-gradient-to-b from-white to-gray-50/80">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息... (Enter发送)"
            disabled={isLoading}
            className="flex-1 px-4 py-2.5
              border-2 border-gray-200 rounded-full
              focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100
              disabled:opacity-50 disabled:cursor-not-allowed
              text-sm placeholder:text-gray-400
              transition-all"
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="size-10 shrink-0
              bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600
              rounded-full flex items-center justify-center
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105
              active:scale-95
              transition-all duration-200"
            aria-label="发送消息"
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
      </footer>
    </div>
  )
}
