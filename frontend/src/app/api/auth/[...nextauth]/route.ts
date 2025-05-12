import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';

// Configuração do NextAuth
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        // Aqui você faria a chamada para sua API de autenticação
        // Por enquanto, vamos simular uma autenticação
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Chamada para API de autenticação (a ser implementada)
          // const response = await fetch('http://localhost:3001/api/auth/login', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({
          //     email: credentials.email,
          //     password: credentials.password,
          //   }),
          // });
          // const user = await response.json();
          
          // Simulação de usuário para desenvolvimento
          if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
            return {
              id: '1',
              name: 'Administrador',
              email: 'admin@example.com',
              role: 'admin',
            };
          }
          
          return null;
        } catch (error) {
          console.error('Erro de autenticação:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  callbacks: {
    async jwt({ token, user }) {
      // Adiciona dados do usuário ao token JWT
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Adiciona dados do token à sessão
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'seu-segredo-temporario',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 