import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthOptions } from 'next-auth';
import { verifyPassword } from '@/src/shared/lib/auth/password-utils';
import { userRepository } from '@/src/entities/user/repository/user.repository';
import {
  InvalidCredentialsError,
  MissingCredentialsError,
  MissingSaltError,
  SessionExpiredError,
  UserNotFoundError,
} from './auth-errors';
import { logger } from '@/src/shared/lib/logger';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        login: { label: 'login', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.login?.trim() || !credentials?.password?.trim()) {
            throw new MissingCredentialsError();
          }

          const { login, password } = credentials;

          const user = await userRepository.findUserByLogin(login);

          if (!user) {
            logger.warn(`[AUTH] User not found: ${login}`);
            throw new UserNotFoundError(login);
          }

          if (!user.salt) {
            logger.error(`[AUTH] Missing salt for user: ${login}`);
            throw new MissingSaltError(login);
          }

          const isPasswordValid = await verifyPassword(password, user.password, user.salt);

          if (!isPasswordValid) {
            logger.warn(`[AUTH] Invalid password for user: ${login}`);
            throw new InvalidCredentialsError();
          }

          // Успешная аутентификация
          logger.info(`[AUTH] User authenticated: ${login}`);

          return {
            id: String(user.id),
            login: user.login,
          };
        } catch (error) {
          // Логируем ошибку и пробрасываем дальше
          logger.error('[AUTH] Authorization error:', error);

          if (error instanceof Error) {
            throw error;
          }

          throw new InvalidCredentialsError();
        }
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
      // Только credentials провайдер
      if (account?.provider !== 'credentials') {
        return false;
      }

      // Дополнительная валидация при необходимости
      return true;
    },

    async jwt({ token, user }) {
      // Добавляем user из authorize
      if (user) {
        token.id = user.id;
        token.login = user.login;
      }

      // Проверка срока действия токена
      if (token.exp && Date.now() > (token.exp as number) * 1000) {
        logger.warn('[AUTH] JWT token expired');
        throw new SessionExpiredError();
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

  debug: process.env.NODE_ENV === 'development',

  events: {
    async signIn(message) {
      logger.info(`[AUTH] Sign in: ${message.user?.login}`);
    },
    async signOut(message) {
      logger.info(`[AUTH] Sign out: ${message.session?.user?.login}`);
    },
  },
};
