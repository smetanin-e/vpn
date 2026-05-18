import { TransactionType } from '@/generated/prisma/enums';
import { clientRepository } from '@/src/entities/client/repository/client.repository';
import { peerRepository } from '@/src/entities/peer/repository/peer.repository';
import { getPeerApi } from '@/src/features/peer/api/peer-api-cache';
import { prisma } from '@/src/shared/lib/prisma';

export async function dailyCharge() {
  try {
    //Получить всех активных клиентов c is-free = false и status = active
    const clients = await clientRepository.findClientsForPayment();
    //списать с баланса клиента стоимость тарифа
    //Если баланс клиента меньше стоимости тарифа, то отключить клиента (status = inactive)
    //Отключить пир на wg сервере

    await Promise.all(
      clients.map(async (client) => {
        try {
          const tariff = client.tariff;
          const balance = client.balance;

          // ❗ если нет пира — просто пропускаем
          if (!client.peer || !client.peer.server) return;

          const api = getPeerApi(client.peer.server);
          const newBalance = balance - tariff;
          await prisma.$transaction([
            prisma.client.update({
              where: { id: client.id },
              data: { balance: { decrement: tariff } },
            }),

            prisma.balanceTransaction.create({
              data: {
                clientId: client.id,
                amount: tariff,
                type: TransactionType.DAILY_CHARGE,
              },
            }),
          ]);
          if (newBalance <= 0) {
            await api.changeEnable(client.peer.externalId, false);
            await peerRepository.updatePeerStatus(client.peer.id, false);
          }
        } catch (error) {
          console.error(`Daily charge error for client ${client.id}`, error);
        }
      }),
    );
  } catch (error) {
    console.error('Daily charge global error', error);
  }
}
