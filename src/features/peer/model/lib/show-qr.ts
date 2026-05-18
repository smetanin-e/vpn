import { clientAxiosInstance } from '@/src/shared/api/client';

export const showQrCode = async (dbPeerId: number) => {
  try {
    const res = await clientAxiosInstance.get(`/peer/${dbPeerId}/wireguard/qr`, {
      responseType: 'blob',
    });

    return URL.createObjectURL(res.data);
  } catch (error) {
    console.error('[showQrCode]', error);
  }
};
