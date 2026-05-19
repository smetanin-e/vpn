import { AppError } from '@/src/shared/lib/errors/app-error';

export class AuthError extends AppError {
  constructor(message: string, code: string = 'AUTH_ERROR') {
    super(message, 401, code);
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('Неверный логин или пароль', 'INVALID_CREDENTIALS');
  }
}

export class MissingCredentialsError extends AuthError {
  constructor() {
    super('Логин и пароль обязательны', 'MISSING_CREDENTIALS');
  }
}

export class UserNotFoundError extends AuthError {
  constructor(login: string) {
    super(`Пользователь ${login} не найден`, 'USER_NOT_FOUND');
  }
}

export class MissingSaltError extends AuthError {
  constructor(login: string) {
    super(`Ошибка конфигурации аутентификации для ${login}`, 'MISSING_SALT');
  }
}

export class InvalidPasswordError extends AuthError {
  constructor() {
    super('Неверный пароль', 'INVALID_PASSWORD');
  }
}

export class SessionExpiredError extends AuthError {
  constructor() {
    super('Сессия истекла', 'SESSION_EXPIRED');
  }
}
