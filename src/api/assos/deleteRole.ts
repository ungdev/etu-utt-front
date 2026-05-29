import { API } from '@/api/api';
import { Role } from './member.interface';

export type DeletedRole = Omit<Role, 'members'>;

export function deleteRole(api: API, assoId: string, roleId: string) {
  return api.delete<DeletedRole>(`/assos/${assoId}/roles/${roleId}`);
}
