'use server';

import { generateSalt, hashPassword, verifyPassword } from '@/src/shared/lib/auth/password-utils';
import { ChangePasswordType } from '../schemas/change-password-schema';
import { userRepository } from '@/src/entities/user/repository/user.repository';
import { NotFoundError, ValidationError } from '@/src/shared/lib/errors/app-error';
import { logger } from '@/src/shared/lib/logger';
import { handleActionError } from '@/src/shared/lib/action-error-handler';

export const changeUserPasswordAction = async (userId: number, formData: ChangePasswordType) => {
  try {
    const user = await userRepository.findUserByIdWithPassword(userId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    const isValidPassword = await verifyPassword(
      formData.currentPassword,
      user.password,
      user.salt!,
    );
    if (!isValidPassword) {
      throw new ValidationError('Текущий пароль неверный');
    }

    const salt = generateSalt();
    const hashedPassword = await hashPassword(formData.password, salt);

    await userRepository.updatePassword(user.id, hashedPassword, salt);

    return { success: true, message: 'Пароль успешно изменен' };
  } catch (error) {
    logger.error(`[CHANGE_USER_PASSWORD] Server error`, error);
    return handleActionError(error);
  }
};
