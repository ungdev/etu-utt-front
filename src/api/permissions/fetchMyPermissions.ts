import { API } from '@/api/api';
import { Permissions } from '@/api/permissions/permissions.interface';

export function fetchMyPermissions(api: API): Promise<Permissions | undefined | null> {
  return api.get<Permissions>('/auth/permissions/current').toPromise();
}
