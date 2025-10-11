'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Lock, User, Eye, EyeOff, Loader2, X, MessageCircle } from 'lucide-react'

interface LoginModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function LoginModal({ onClose, onSuccess }: LoginModalProps) {
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
        // 登录成功
        onSuccess()
      }
    } catch (error) {
      setError('登录失败,请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* 登录悬浮窗 */}
      <div
        className="fixed bottom-6 right-6 z-50
          w-80 bg-white/98 backdrop-blur-xl
          rounded-2xl shadow-2xl
          border border-gray-200/80
          flex flex-col overflow-hidden
          animate-slide-in"
      >
        {/* 头部 */}
        <header
          className="flex items-center justify-between
            px-4 py-3.5
            bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600"
        >
          <div className="flex items-center gap-2">
            <MessageCircle size={18} className="text-white" />
            <span className="text-white font-semibold text-sm">
              登录以使用聊天
            </span>
          </div>

          <button
            onClick={onClose}
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* 用户名 */}
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              用户名
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-3 py-2.5 text-sm
                  border-2 border-gray-200 rounded-xl
                  focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100
                  transition-all"
                required
                autoFocus
              />
            </div>
          </div>

          {/* 密码 */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              密码
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full pl-10 pr-10 py-2.5 text-sm
                  border-2 border-gray-200 rounded-xl
                  focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100
                  transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                  text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
              <span className="text-red-500">⚠</span>
              {error}
            </div>
          )}

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600
              text-white font-semibold py-3 rounded-xl text-sm
              hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02]
              active:scale-95
              disabled:opacity-50 disabled:cursor-wait disabled:hover:scale-100
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
            默认账号: <span className="font-mono text-gray-700">admin / admin123</span>
          </div>
        </form>
      </div>
    </>
  )
}
