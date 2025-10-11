import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { Provider } from 'jotai'
import './globals.css'

export const metadata: Metadata = {
  title: 'Notion Bookmark & Chat v2',
  description: '智能书签管理系统 - 基于 Notion 和 n8n',
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🌲%3C/text%3E%3C/svg%3E"
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <SessionProvider>
          <Provider>
            {children}
          </Provider>
        </SessionProvider>
      </body>
    </html>
  )
}
