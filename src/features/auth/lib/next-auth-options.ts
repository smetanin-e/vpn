import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthOptions } from 'next-auth';
import { verifyPassword } from '@/src/shared/lib/auth/password-utils';
import { userRepository } from '@/src/entities/user/repository/user.repository';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        login: { label: 'login', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) {
          console.error('[NEXT_AUTH] Missing login or password');
          throw new Error('Логин и пароль обязательны');
        }

        const { login, password } = credentials;

        const user = await userRepository.findUserByLogin(login);

        if (!user) {
          console.error(`[NEXT_AUTH] User not found: ${login}`);
          throw new Error('Неверный логин или пароль');
        }

        if (!user.salt) {
          console.error(`[NEXT_AUTH] Missing salt for user: ${login}`);
          throw new Error('Ошибка аутентификации');
        }

        const isPasswordValid = await verifyPassword(password, user.password, user.salt);

        if (!isPasswordValid) {
          console.error(`[NEXT_AUTH] Invalid password for user: ${login}`);
          throw new Error('Неверный логин или пароль');
        }

        return {
          id: String(user.id),
          login: user.login,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
  callbacks: {
    async signIn({ account }) {
      return account?.provider === 'credentials';
    },

    async jwt({ token, user }) {
      // Добавляем user из authorize
      if (user) {
        token.id = user.id;
        token.login = user.login;
      }

      return token;
    },

    session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
      }

      return session;
    },
  },
};
