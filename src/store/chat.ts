'use client'

import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { nanoid } from 'nanoid'
import type { Message } from '@/types'

// 会话 ID (持久化到 localStorage)
export const sessionIdAtom = atomWithStorage<string>(
  'chat-session-id',
  nanoid()
)

// 消息列表
export const messagesAtom = atom<Message[]>([{
  id: nanoid(),
  content: '您好！我是您的书签管理助手,有什么可以帮助您的吗？',
  role: 'assistant',
  timestamp: Date.now()
}])

// 聊天窗口打开状态
export const chatOpenAtom = atom(false)

// 加载状态
export const isLoadingAtom = atom(false)

// 最后已读消息的时间戳
export const lastReadTimestampAtom = atomWithStorage<number>(
  'chat-last-read-timestamp',
  Date.now()
)

// 未读消息数 (派生 atom)
export const unreadCountAtom = atom((get) => {
  const messages = get(messagesAtom)
  const isOpen = get(chatOpenAtom)
  const lastReadTimestamp = get(lastReadTimestampAtom)

  // 窗口打开时，未读数为0
  if (isOpen) return 0

  // 统计最后已读时间之后的助手消息
  const unreadMessages = messages.filter(m =>
    m.role === 'assistant' &&
    m.timestamp > lastReadTimestamp
  )

  return unreadMessages.length
})

// 标记消息为已读的 atom
export const markAsReadAtom = atom(
  null,
  (get, set) => {
    set(lastReadTimestampAtom, Date.now())
  }
)

// 发送消息 action atom
export const sendMessageAtom = atom(
  null,
  async (get, set, content: string) => {
    const sessionId = get(sessionIdAtom)
    set(isLoadingAtom, true)

    // 添加用户消息
    const userMsg: Message = {
      id: nanoid(),
      content,
      role: 'user',
      timestamp: Date.now()
    }
    set(messagesAtom, [...get(messagesAtom), userMsg])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, content })
      })

      const data = await response.json()

      // 添加助手消息
      const assistantMsg: Message = {
        id: nanoid(),
        content: data.text || data.message || '抱歉,无法获取响应',
        role: 'assistant',
        timestamp: Date.now(),
        isError: !response.ok
      }
      set(messagesAtom, [...get(messagesAtom), assistantMsg])
    } catch (error) {
      // 添加错误消息
      const errorMsg: Message = {
        id: nanoid(),
        content: '网络错误,请稍后重试',
        role: 'assistant',
        timestamp: Date.now(),
        isError: true
      }
      set(messagesAtom, [...get(messagesAtom), errorMsg])
    } finally {
      set(isLoadingAtom, false)
    }
  }
)
