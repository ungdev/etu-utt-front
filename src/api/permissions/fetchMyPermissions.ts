import { API, ResponseHandler } from '@/api/api';
import { Permissions } from '@/api/permissions/permissions.interface';

export function fetchMyPermissions(api: API): ResponseHandler<Permissions, void | Permissions | undefined> {
  return api.get<Permissions>('/auth/permissions/current');
}
