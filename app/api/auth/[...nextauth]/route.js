import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { getUserByEmail } from "@/lib/db"
import { createUserIfNotExists } from "@/lib/db";
import bcrypt from "bcryptjs"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Verificar si es el usuario de ejemplo
        if (
          credentials.email.toLowerCase() === "ejemplo" ||
          credentials.email.toLowerCase() === "ejemplo@ejemplo.com"
        ) {
          return {
            id: "1",
            name: "Usuario Ejemplo",
            email: "ejemplo@ejemplo.com",
            image: "/placeholder.svg?height=32&width=32",
          }
        }

        // Verificar credenciales normales
        try {
          const user = await getUserByEmail(credentials.email)

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
          }
        } catch (error) {
          console.error("Error en la autenticación:", error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const existingUser = await getUserByEmail(user.email);
  
        if (!existingUser) {
          await createUserIfNotExists({
            email: user.email,
            name: user.name,
            image: user.image,
            googleId: user.id,
          });
        }
      }
      return true;
    },
  
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await getUserByEmail(user.email);
        if (dbUser) {
          token.id = dbUser.id;
        }
      }
      return token;
    },
  
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET || "tu-secreto-seguro-aqui",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

