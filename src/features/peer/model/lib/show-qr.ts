import { clientAxiosInstance } from '@/src/shared/api/client';
import { logger } from '@/src/shared/lib/logger';

export const showQrCode = async (dbPeerId: number) => {
  try {
    const res = await clientAxiosInstance.get(`/peer/${dbPeerId}/wireguard/qr`, {
      responseType: 'blob',
    });

    return URL.createObjectURL(res.data);
  } catch (error) {
    logger.error('[showQrCode] failed', error);
  }
};
