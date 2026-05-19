import { AppError } from '@/src/shared/lib/errors/app-error';

export class ChargeError extends AppError {
  constructor(message: string, code: string = 'CHARGE_ERROR') {
    super(message, 500, code);
  }
}

export class ClientNotFoundError extends ChargeError {
  constructor(clientId: number) {
    super(`Клиент ${clientId} не найден`, 'CLIENT_NOT_FOUND');
  }
}

export class PeerNotFoundError extends ChargeError {
  constructor(clientId: number) {
    super(`Пир для клиента ${clientId} не найден`, 'PEER_NOT_FOUND');
  }
}

export class InsufficientBalanceError extends ChargeError {
  constructor(clientId: number, balance: number, tariff: number) {
    super(
      `Недостаточно средств у клиента ${clientId}: баланс ${balance}, тариф ${tariff}`,
      'INSUFFICIENT_BALANCE',
    );
  }
}

export class ChargeTransactionError extends ChargeError {
  constructor(clientId: number, error: Error) {
    super(
      `Ошибка транзакции списания для клиента ${clientId}: ${error.message}`,
      'TRANSACTION_ERROR',
    );
  }
}
