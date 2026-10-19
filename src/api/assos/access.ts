import { API } from '@/api/api';

export type AssoAccessAction = 'CREATE' | 'CLAIM';

export interface AssoAccessRequest {
  email: string;
}

export interface AssoAccessRequestResponse {
  action: AssoAccessAction;
  email: string;
}

export interface AssoAccessInfo {
  action: AssoAccessAction;
  email: string;
  name: string | null;
}

export interface AssoAccessConfirmRequest {
  token: string;
  name?: string;
}

export interface AssoAccessConfirmResponse {
  action: AssoAccessAction;
  asso: {
    id: string;
    name: string;
    email: string;
  };
}

export function requestAssoAccess(api: API, email: string) {
  return api.post<AssoAccessRequest, AssoAccessRequestResponse>('/assos/access/request', { email });
}

export function getAssoAccessInfo(api: API, token: string) {
  return api.get<AssoAccessInfo>(`/assos/access/info?token=${encodeURIComponent(token)}`);
}

export function confirmAssoAccess(api: API, request: AssoAccessConfirmRequest) {
  return api.post<AssoAccessConfirmRequest, AssoAccessConfirmResponse>('/assos/access/confirm', request);
}
