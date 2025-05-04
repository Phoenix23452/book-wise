import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth, { User } from "next-auth";
import CredentialProviders from "next-auth/providers/credentials";
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialProviders({
      async authorize(credentials, request) {
        if (!credentials.email || !credentials.password) {
          return null;
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email.toString()))
          .limit(1);

        if (user.length === 0) return null;

        const isValidPassword = await compare(
          credentials.password.toString(),
          user[0].password,
        );

        return {
          id: user[0].id,
          email: user[0].email,
          name: user[0].fullName,
        } as User;
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      // Persist the user ID on the token returned to the client.
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
});
