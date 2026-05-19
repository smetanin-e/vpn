import { prisma } from '@/src/shared/lib/prisma';
import { groupPeersByServer } from './groupe-peers-by-server';
import { getPeerApi } from '../../api/peer-api-cache';
import { logger } from '@/src/shared/lib/logger';

export async function syncTraffic() {
  try {
    const now = new Date();
    const isFirstDayOfMonth = now.getDate() === 1;
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Получаем всех пиров с их серверами
    const dbPeers = await prisma.peer.findMany({
      select: {
        id: true,
        externalId: true,
        receivedBytes: true,
        sentBytes: true,
        lastHandshake: true,
        server: {
          select: {
            id: true,
            type: true,
            name: true,
            baseUrl: true,
            apiToken: true,
            description: true,
          },
        },
      },
    });

    // Группируем пиров по серверам
    const peersByServer = groupPeersByServer(dbPeers);

    await Promise.all(
      Array.from(peersByServer.entries()).map(async ([serverId, peers]) => {
        const server = peers[0].server!;
        const api = getPeerApi(server);

        try {
          // Получаем данные о трафике через унифицированный API
          const trafficData = await api.getTrafficData();

          // Создаем Map для быстрого поиска по externalId
          const trafficMap = new Map(trafficData.map((item) => [item.externalId, item]));

          await Promise.all(
            peers.map(async (dbPeer) => {
              try {
                const serverPeer = trafficMap.get(dbPeer.externalId);

                if (!serverPeer) {
                  console.warn(`Peer ${dbPeer.externalId} not found on server ${serverId}`);
                  return;
                }

                // Получаем текущие значения из API
                const currentReceived = BigInt(serverPeer.traffic.received);
                const currentSent = BigInt(serverPeer.traffic.sent);
                const currentLastHandshake = serverPeer.lastHandshake;

                // Получаем сохраненные значения из БД
                const dbReceived = dbPeer.receivedBytes;
                const dbSent = dbPeer.sentBytes;
                const dbLastHandshake = dbPeer.lastHandshake;

                // Если первое число месяца - сохраняем статистику за прошлый месяц
                if (isFirstDayOfMonth) {
                  // Проверяем, не сохранили ли уже статистику за этот месяц
                  const existingStats = await prisma.peerMonthlyStats.findFirst({
                    where: {
                      peerId: dbPeer.id,
                      month: lastMonthStart,
                    },
                  });

                  // Сохраняем только если еще не сохраняли
                  if (!existingStats) {
                    await prisma.peerMonthlyStats.create({
                      data: {
                        peerId: dbPeer.id,
                        month: lastMonthStart,
                        receivedBytes: dbReceived,
                        sentBytes: dbSent,
                      },
                    });

                    console.log(
                      `Saved monthly stats for peer ${dbPeer.id}: received=${dbReceived.toString()}, sent=${dbSent.toString()}`,
                    );
                  }
                }

                // Обновляем данные в БД
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const updateData: any = {};

                // Обновляем трафик, если он изменился
                if (currentReceived !== dbReceived || currentSent !== dbSent) {
                  updateData.receivedBytes = currentReceived;
                  updateData.sentBytes = currentSent;
                }

                // Обновляем lastHandshake, если он изменился и не равен 0
                if (currentLastHandshake && currentLastHandshake !== dbLastHandshake) {
                  updateData.lastHandshake = currentLastHandshake;
                }

                // Если есть что обновлять
                if (Object.keys(updateData).length > 0) {
                  await prisma.peer.update({
                    where: { id: dbPeer.id },
                    data: updateData,
                  });

                  console.log(
                    `Updated peer ${dbPeer.id}: received=${currentReceived.toString()}, sent=${currentSent.toString()}, lastHandshake=${currentLastHandshake}`,
                  );
                }

                // Логируем подозрительные ситуации (если трафик уменьшился)
                if (currentReceived < dbReceived || currentSent < dbSent) {
                  const receivedDiff = currentReceived - dbReceived;
                  const sentDiff = currentSent - dbSent;

                  console.warn(
                    `Negative traffic diff for peer ${dbPeer.id}: ` +
                      `receivedDiff=${receivedDiff.toString()}, sentDiff=${sentDiff.toString()}. ` +
                      `Possible server restart or manual reset.`,
                  );
                }
              } catch (error) {
                logger.error(
                  `[syncTraffic] Sync error for peer ${dbPeer.id} (server ${serverId})`,
                  error,
                );
              }
            }),
          );
        } catch (error) {
          logger.error(`[syncTraffic] Sync error for server ${serverId} (${server?.name})`, error);
        }
      }),
    );

    logger.info(`[syncTraffic] Traffic sync completed successfully`);
  } catch (error) {
    logger.error(`[syncTraffic] Global sync error`, error);
  }
}
