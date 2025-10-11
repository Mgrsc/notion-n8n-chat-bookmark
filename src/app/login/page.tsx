'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Lock, User, Eye, EyeOff, Loader2, X, MessageCircle } from 'lucide-react'
import { NotionEmbed } from '@/components/notion-embed'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('用户名或密码错误')
      } else {
        // 登录成功后返回首页
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      setError('登录失败,请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      {/* Notion 书签背景 */}
      <NotionEmbed />

      {/* 登录悬浮窗 - 类似聊天窗口样式 */}
      <div
        className="fixed bottom-6 right-6 z-50
          w-80 bg-white/95 backdrop-blur-md
          rounded-2xl shadow-2xl
          border border-gray-200/50
          flex flex-col overflow-hidden
          animate-slide-in"
      >
        {/* 头部 */}
        <header
          className="flex items-center justify-between
            px-4 py-3
            bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600"
        >
          <div className="flex items-center gap-2">
            <MessageCircle size={18} className="text-white" />
            <span className="text-white font-medium text-sm">
              登录以使用聊天
            </span>
          </div>

          <button
            onClick={handleClose}
            className="text-white/90 hover:text-white
              hover:bg-white/20 rounded-lg p-1
              transition-colors"
            aria-label="关闭"
            type="button"
          >
            <X size={18} />
          </button>
        </header>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* 用户名 */}
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-xs font-medium text-gray-700">
              用户名
            </label>
            <div className="relative">
              <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-emerald-500
                  transition-all"
                required
              />
            </div>
          </div>

          {/* 密码 */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-medium text-gray-700">
              密码
            </label>
            <div className="relative">
              <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full pl-9 pr-9 py-2 text-sm border border-gray-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-emerald-500
                  transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
              {error}
            </div>
          )}

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={isLoading || !username || !password}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600
              text-white font-medium py-2 rounded-lg text-sm
              hover:shadow-lg hover:scale-[1.02]
              active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                登录中...
              </>
            ) : (
              '登录'
            )}
          </button>

          {/* 提示 */}
          <div className="text-center text-xs text-gray-500 pt-1">
            默认: admin / admin123
          </div>
        </form>
      </div>
    </div>
  )
}
