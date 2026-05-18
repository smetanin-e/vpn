import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/next-auth-options';
import { userRepository } from '@/src/entities/user/repository/user.repository';

export const getUserSession = async () => {
  const session = await getServerSession(authOptions);

  const sessionUser = session?.user;
  if (!sessionUser) return null;

  const user = await userRepository.findUserById(Number(sessionUser.id));

  if (!user) return null;
  return user;
};
