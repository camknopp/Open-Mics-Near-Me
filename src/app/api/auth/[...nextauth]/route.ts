import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google'; 
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';

export const authOptions: AuthOptions = {
  // 1. Adapter: Tells NextAuth.js how to store user, account, and session data
  adapter: PrismaAdapter(prisma),

  // 2. Providers: Defines which authentication methods are available
  providers: [
  ],

  // 3. Session Strategy: How session data is stored and managed
  session: {
    strategy: 'jwt',
  },

  // 4. Callbacks: Customize behavior after certain auth events
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // Redirects unauthenticated users to your custom /login page
  },

  // 6. Debugging
  debug: process.env.NODE_ENV === 'development',
};

// NextAuth.js takes the authOptions and creates the actual API handlers.
// The App Router requires explicit exports for GET/POST.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };