export interface AmneziaTraffic {
  received: number;
  sent: number;
}

export interface AmneziaPeerResponse {
  id: string;
  name: string | null;
  status: 'active' | 'inactive' | 'disabled';
  allowedIps: string[];
  lastHandshake: number;
  traffic: AmneziaTraffic;
  endpoint: string | null;
  online: boolean;
  expiresAt: string | null;
  protocol: 'amneziawg2';
}

export interface AmneziaUser {
  username: string;
  peers: AmneziaPeerResponse[];
}

export interface AmneziaPeersResponse {
  total: number;
  items: AmneziaUser[];
}

export interface AmneziaCreatePeerResponse {
  message: string;
  client: AmneziaClient;
}

export interface AmneziaClient {
  id: string;
  config: string;
  protocol: 'amneziawg2';
}

export interface AmneziaPeerStatus {
  status: 'active' | 'disabled';
}

export interface AmneziaChangeStatusRequest {
  clientId: string;
  status: AmneziaPeerStatus;
}

export interface AmneziaChangeStatusResponse {
  message: string;
  client: {
    id: string;
    status: AmneziaPeerStatus;
  };
}

export interface AmneziaDeletePeerRequest {
  clientId: string;
}

export interface AmneziaDeletePeerResponse {
  message: string;
  //success: boolean;
}

export interface AmneziaGetConfigResponse {
  config: string;
}
