import { NextResponse } from 'next/server';

import { getUserSession } from '@/src/features/auth/actions/get-user-session';
import { serverRepository } from '@/src/entities/server/repository/server.repository';
import { transformServerStats } from '@/src/entities/server/model/libs/transform-server-stats';

export async function GET() {
  try {
    const user = await getUserSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized — user not found' }, { status: 401 });
    }

    const servers = await serverRepository.getForStats();

    if (!servers) {
      return NextResponse.json({ error: 'Servers not found' }, { status: 404 });
    }

    const stats = transformServerStats(servers);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('[API_STATS_GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
