import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import type { ChatResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    // 验证认证
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { sessionId, content } = await request.json()

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid message format' },
        { status: 400 }
      )
    }

    // n8n webhook 配置
    const webhookUrl = process.env.N8N_CHAT_WEBHOOK_URL
    const username = process.env.N8N_CHAT_AUTH_USERNAME
    const password = process.env.N8N_CHAT_AUTH_PASSWORD

    if (!webhookUrl) {
      console.error('N8N_CHAT_WEBHOOK_URL is not configured')
      return NextResponse.json(
        {
          success: false,
          error: 'Webhook not configured',
          text: '聊天服务暂时不可用，请稍后再试。'
        },
        { status: 500 }
      )
    }

    // 准备请求头
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Session-Id': sessionId || 'default-session',
      'Accept': 'application/json',
      'Accept-Encoding': 'identity',
      'User-Agent': 'Notion-Bookmark-Chat/2.0'
    }

    // 添加 Basic Auth
    if (username && password) {
      const credentials = Buffer.from(`${username}:${password}`).toString('base64')
      headers['Authorization'] = `Basic ${credentials}`
    }

    // 发送到 n8n
    const requestBody = {
      sessionId: sessionId || 'default-session',
      action: 'sendMessage',
      chatInput: content.trim()
    }

    console.log('Sending request to n8n:', {
      url: webhookUrl,
      hasAuth: !!(username && password),
      username: username,
      bodyKeys: Object.keys(requestBody)
    })

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(50000)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`n8n webhook error: ${response.status}`, {
        status: response.status,
        statusText: response.statusText,
        responseText: errorText.substring(0, 200),
        headers: Object.fromEntries(response.headers.entries())
      })
      return NextResponse.json(
        {
          success: false,
          error: `Webhook error: ${response.status}`,
          text: '抱歉，AI 助手暂时无法回复。请稍后再试。',
          debug: process.env.NODE_ENV === 'development' ? {
            status: response.status,
            statusText: response.statusText,
            errorPreview: errorText.substring(0, 100)
          } : undefined
        },
        { status: 500 }
      )
    }

    let data: ChatResponse
    try {
      const responseText = await response.text()
      console.log('n8n response:', responseText.substring(0, 200))
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse n8n response:', parseError)
      return NextResponse.json({
        success: true,
        text: '收到您的消息，正在处理中...'
      })
    }

    // n8n 可能返回 output, text, message, response 等字段
    const botMessage = data.output || data.text || data.message || data.response || '收到您的消息，正在处理中...'

    console.log('Bot message extracted:', botMessage.substring(0, 100))

    return NextResponse.json({
      success: true,
      text: botMessage,
      metadata: {
        timestamp: new Date().toISOString(),
        sessionId: sessionId
      }
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        text: '抱歉，服务出现错误。请稍后再试。'
      },
      { status: 500 }
    )
  }
}
