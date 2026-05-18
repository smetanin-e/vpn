import { serverRepository } from '@/src/entities/server/repository/server.repository';
import { getUserSession } from '@/src/features/auth/actions/get-user-session';

import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getUserSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized — user not found' }, { status: 401 });
  }

  try {
    const servers = await serverRepository.getAll();
    return NextResponse.json(servers);
  } catch (error) {
    console.error('[API_SERVER_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
