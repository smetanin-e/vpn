'use server';

import { clientRepository } from '@/src/entities/client/repository/client.repository';
import { generateAccessToken, hashToken } from '@/src/shared/lib/auth/password-utils';

export async function generateClientAccess(clientId: number) {
  const { tokenId, secret, fullToken } = generateAccessToken();
  const hash = await hashToken(secret);
  const host = process.env.HOST || 'http://localhost:3000';

  await clientRepository.updateToken(clientId, tokenId, hash);

  return {
    accessLink: `${host}/client/${fullToken}`,
  };
}
