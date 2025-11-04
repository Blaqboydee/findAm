import NextAuth from "next-auth"
import bcrypt from "bcryptjs"
import User from "../../../../models/User"

import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      async authorize(credentials) {
        const { email, password } = credentials

       const user = await User.findOne({ email })
if (!user) return null

const isValid = await bcrypt.compare(password, user.password)
if (!isValid) return null

return { id: user._id, name: user.name, email: user.email, role: user.role }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role
      return session
    }
  },

  pages: {
    signIn: '/',  
  }
})

export { handler as GET, handler as POST }
