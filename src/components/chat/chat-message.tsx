'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeHighlight from 'rehype-highlight'
import type { Message } from '@/types'
import { cn } from '@/lib/utils'

import 'highlight.js/styles/github.css'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isUser = message.role === 'user'
  const isError = message.isError

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'relative group max-w-[80%] rounded-2xl px-4 py-3 text-sm',
          isUser && 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
          isError && 'bg-red-50 text-red-800 border border-red-200',
          !isUser && !isError && 'bg-gray-100 text-gray-900 border border-gray-200'
        )}
      >
        {/* 复制按钮 */}
        {!isUser && !isError && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2
              opacity-0 group-hover:opacity-100
              size-6 rounded-full
              bg-white/80 hover:bg-white
              flex items-center justify-center
              transition-all duration-200"
            aria-label="复制消息"
          >
            {copied ? (
              <Check size={14} className="text-green-600" />
            ) : (
              <Copy size={14} className="text-gray-600" />
            )}
          </button>
        )}

        {/* Markdown 渲染 */}
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeHighlight]}
          className={cn(
            'prose prose-sm max-w-none',
            'prose-p:my-2 prose-p:leading-relaxed',
            'prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
            'prose-pre:my-2 prose-pre:bg-gray-900',
            'prose-headings:mt-4 prose-headings:mb-2',
            'prose-ul:my-2 prose-ol:my-2',
            isUser && 'prose-a:text-white prose-code:bg-black/10 prose-code:text-white',
            !isUser && 'prose-a:text-emerald-600 prose-code:bg-black/5'
          )}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
