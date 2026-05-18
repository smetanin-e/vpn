import { Server } from '@/generated/prisma/client';
import axios from 'axios';

export function createApiClient(server: Server) {
  // Для Amnezia API используем x-api-key
  if (server.type === 'AMNEZIA_API') {
    return axios.create({
      baseURL: server.baseUrl,
      headers: {
        'x-api-key': server.apiToken,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  // Для WG REST API (если использует Bearer)
  return axios.create({
    baseURL: server.baseUrl,
    headers: {
      Authorization: `Bearer ${server.apiToken}`,
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });
}
