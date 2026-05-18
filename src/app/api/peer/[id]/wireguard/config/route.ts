import { getWgPeerConfig } from '@/src/entities/peer/api/get-wg-peer-config';
import { peerRepository } from '@/src/entities/peer/repository/peer.repository';
import { getUserSession } from '@/src/features/auth/actions/get-user-session';
import { createPeerApi } from '@/src/features/peer/api/create-peer-api';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = await getUserSession();
    if (!authUser)
      return NextResponse.json({ error: 'Unauthorized — user not found' }, { status: 401 });

    const dbPeerId = Number((await params).id);

    const peer = await peerRepository.findPeerById(dbPeerId);

    if (!peer)
      return NextResponse.json({ error: 'Файл vpn конфигурации не найден' }, { status: 404 });

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
        message: 'Не удалось запросить конфиг. Ошибка на сервере WG',
      });
    }

    return new NextResponse(config, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="vpn${peer.clientId}.conf"`,
      },
    });
  } catch (error) {
    console.error('[API_VPN_CONFIG]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
