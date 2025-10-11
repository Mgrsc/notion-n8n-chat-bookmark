import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: '用户名', type: 'text' },
        password: { label: '密码', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const validUsername = process.env.AUTH_USERNAME || 'admin'
        const validPassword = process.env.AUTH_PASSWORD || 'admin123'

        const isValidUsername = credentials.username === validUsername
        const isValidPassword = credentials.password === validPassword

        if (isValidUsername && isValidPassword) {
          return {
            id: '1',
            name: validUsername,
            email: `${validUsername}@local.host`
          }
        }

        return null
      }
    })
  ],

  pages: {
    signIn: '/login'
  },

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60 // 7天
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
})
