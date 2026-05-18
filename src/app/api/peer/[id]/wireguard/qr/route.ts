import { getWgPeerConfig } from '@/src/entities/peer/api/get-wg-peer-config';
import { peerRepository } from '@/src/entities/peer/repository/peer.repository';
import { getUserSession } from '@/src/features/auth/actions/get-user-session';
import { createPeerApi } from '@/src/features/peer/api/create-peer-api';

import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    console.log({ params });
    const dbPeerId = Number((await params).id);
    console.log(dbPeerId);
    const authUser = await getUserSession();
    if (!authUser)
      return NextResponse.json({ error: 'Пользователь не авторизован' }, { status: 401 });

    const peer = await peerRepository.findPeerById(dbPeerId);
    if (!peer)
      return NextResponse.json({ error: 'Файлы vpn конфигурацый не найдены' }, { status: 404 });
    const peerApiInstance = createPeerApi(peer.server!);

    let config;
    if ('downloadPeerConfig' in peerApiInstance) {
      // wireguarg config
      config = await getWgPeerConfig(peerApiInstance, peer.externalId);
    } else {
      config = peer.config;
    }

    if (!config) {
      return NextResponse.json({
        success: false,
        message: 'Не удалось запросить конфиг. Ошибка на сервере',
      });
    }

    // Генерируем QR в base64 (PNG)
    const qr = await QRCode.toDataURL(config, { errorCorrectionLevel: 'L' });

    // Возвращаем как изображение
    const base64 = qr.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="vpn${peer.clientId}.png"`,
      },
    });
  } catch (error) {
    console.error('[API_VPN_CONFIG_QR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
