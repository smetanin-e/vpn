import z from 'zod';

export const ServerTypeEnum = z.enum(['WG_REST_API', 'AMNEZIA_API']);

export const SERVER_TYPE_OPTIONS = [
  { value: 'WG_REST_API', label: 'WG REST API' },
  { value: 'AMNEZIA_API', label: 'Amnezia API' },
];
