'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useAtom } from 'jotai'
import { useSession } from 'next-auth/react'
import { chatOpenAtom } from '@/store/chat'
import { LoginModal } from './login-modal'

export function ChatFab() {
  const [isOpen, setIsOpen] = useAtom(chatOpenAtom)
  const [showLogin, setShowLogin] = useState(false)
  const { data: session, status } = useSession()

  if (isOpen) return null

  const handleClick = () => {
    // 检查认证状态
    if (status === 'unauthenticated') {
      // 未登录，显示登录框
      setShowLogin(true)
      return
    }

    if (status === 'authenticated') {
      // 已登录，打开聊天窗口
      setIsOpen(true)
    }
  }

  const handleLoginSuccess = () => {
    setShowLogin(false)
    setIsOpen(true)
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={status === 'loading'}
        className="fixed bottom-6 right-6 z-50 group
          size-14 rounded-full
          bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600
          shadow-lg shadow-emerald-500/40
          hover:shadow-xl hover:shadow-emerald-500/50
          hover:-translate-y-1 hover:scale-105
          active:scale-95
          disabled:opacity-50 disabled:cursor-wait
          transition-all duration-300 ease-out
          focus-visible:outline-none focus-visible:ring-4
          focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
        aria-label="打开聊天"
        type="button"
      >
        {/* 脉冲动画 */}
        <span
          className="absolute inset-0 rounded-full
            animate-ping bg-emerald-400/60
            group-hover:animate-none"
          aria-hidden="true"
        />

        {/* 图标 */}
        <MessageCircle
          className="relative text-white m-auto"
          size={28}
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </button>

      {/* 登录模态框 */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </>
  )
}
