/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/src/shared/lib/prisma';
import { ClientChargeResult } from './process-client-charge';
import { ChargeStatus } from '@/generated/prisma/enums';
import { Prisma } from '@/generated/prisma/client';

export async function createDailyChargeLog(
  date: Date,
  stats: {
    total: number;
    successful: number;
    failed: number;
    details: ClientChargeResult[];
    duration: number;
  },
  results: ClientChargeResult[],
  totalAmount: number = 0,
  globalError?: string,
) {
  const disabledPeers = results
    .filter((r) => r.wasDisabled)
    .map((r) => ({ clientId: r.clientId, newBalance: r.newBalance }));

  const failedDetails = results
    .filter((r) => !r.success)
    .map((r) => ({ clientId: r.clientId, error: r.error }));

  // ✅ Исправлено: используем Prisma.JsonNull для null, а не просто null
  const failedDetailsJson =
    failedDetails.length > 0 ? JSON.stringify(failedDetails) : Prisma.JsonNull;

  const disabledPeersJson =
    disabledPeers.length > 0 ? JSON.stringify(disabledPeers) : Prisma.JsonNull;

  await prisma.dailyChargeLog.upsert({
    where: { date },
    update: {
      totalClients: stats.total,
      successfulCount: stats.successful,
      failedCount: stats.failed,
      totalAmount: totalAmount,
      totalBalance: results.reduce((sum, r) => sum + (r.newBalance || 0), 0),
      failedDetails: failedDetailsJson as any,
      disabledPeers: disabledPeersJson as any,
      duration: stats.duration,
      status: globalError ? ChargeStatus.FAILED : ChargeStatus.COMPLETED,
      error: globalError || null,
      updatedAt: new Date(),
    },
    create: {
      date,
      totalClients: stats.total,
      successfulCount: stats.successful,
      failedCount: stats.failed,
      totalAmount,
      totalBalance: results.reduce((sum, r) => sum + (r.newBalance || 0), 0),
      failedDetails: failedDetailsJson as any,
      disabledPeers: disabledPeersJson as any,
      duration: stats.duration,
      status: globalError ? ChargeStatus.FAILED : ChargeStatus.COMPLETED,
      error: globalError || null,
    },
  });
}
