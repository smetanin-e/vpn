// types/charge-log.types.ts
export type ChargeLogInput = {
  totalClients: number;
  successfulCount: number;
  failedCount: number;
  totalAmount: number;
  disabledPeers: Array<{
    clientId: number;
    peerId: number;
    reason: string;
    newBalance: number;
  }>;
  failedDetails: Array<{
    clientId: number;
    error: string;
    step: 'update_balance' | 'disable_peer' | 'api_call';
  }>;
};

export type ChargeLog = ChargeLogInput & {
  id: number;
  date: Date;
  status: 'COMPLETED' | 'FAILED';
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type DailyChargeResult = {
  total: number;
  successful: number;
  failed: number;
  details: {
    success: boolean;
    clientId: number;
    newBalance?: number;
    wasDisabled?: boolean;
    error?: string;
    timestamp: string;
  }[];
  duration: number;
};

// Тип успешного ответа API
export type SuccessResponse = {
  success: true;
  requestId: string;
} & DailyChargeResult;

// Тип ответа с ошибкой
export type ErrorResponse = {
  success: false;
  error: string;
  code?: string;
  requestId?: string;
};

export type DailyChargeApiResponse = SuccessResponse | ErrorResponse;
