'use server';

import { clientRepository } from '@/src/entities/client/repository/client.repository';
import { handleActionError } from '@/src/shared/lib/action-error-handler';
import { generateAccessToken, hashToken } from '@/src/shared/lib/auth/password-utils';
import { logger } from '@/src/shared/lib/logger';

type GenerateClientAccessResult = {
  success: boolean;
  accessLink?: string;
};

export async function generateClientAccess(clientId: number): Promise<GenerateClientAccessResult> {
  try {
    const { tokenId, secret, fullToken } = generateAccessToken();
    const hash = await hashToken(secret);
    const host = process.env.HOST || 'http://localhost:3000';

    await clientRepository.updateToken(clientId, tokenId, hash);

    return {
      success: true,
      accessLink: `${host}/client/${fullToken}`,
    };
  } catch (error) {
    logger.error(`[GENERATE_CLIENT_TOKEN] Failed for client ${clientId}`, error);
    return handleActionError(error);
  }
}
