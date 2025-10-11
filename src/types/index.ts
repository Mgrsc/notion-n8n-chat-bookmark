// 消息类型
export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: number
  isError?: boolean
}

// 聊天响应类型
export interface ChatResponse {
  success: boolean
  text?: string
  message?: string
  output?: string      // n8n 返回的字段
  response?: string    // 备用字段
  error?: string
}

// 环境变量类型
export interface Env {
  N8N_CHAT_WEBHOOK_URL?: string
  N8N_CHAT_AUTH_USERNAME?: string
  N8N_CHAT_AUTH_PASSWORD?: string
  NEXT_PUBLIC_NOTION_EMBED_URL?: string
  AUTH_USERNAME?: string
  AUTH_PASSWORD_HASH?: string
  NEXTAUTH_SECRET?: string
  NEXTAUTH_URL?: string
}
