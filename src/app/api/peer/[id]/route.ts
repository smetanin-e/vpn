import { NextRequest, NextResponse } from 'next/server';

import { getUserSession } from '@/src/features/auth/actions/get-user-session';
import { peerRepository } from '@/src/entities/peer/repository/peer.repository';
import { handleApiError } from '@/src/shared/lib/api-error-handler';
import { NotFoundError, UnauthorizedError } from '@/src/shared/lib/errors/app-error';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserSession();
    if (!user) {
      throw new UnauthorizedError();
    }

    const dbPeerId = Number((await params).id);

    const peer = await peerRepository.findPeerByIdWithRelations(dbPeerId);

    if (!peer) {
      throw new NotFoundError('Peer не найден');
    }

    return NextResponse.json(peer);
  } catch (error) {
    return handleApiError(error);
  }
}
