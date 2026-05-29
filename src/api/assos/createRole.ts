import { API } from '@/api/api';
import { Role } from './member.interface';

export type CreateRoleRequest = {
  name: string;
};
export type CreatedRole = Omit<Role, 'members'>;

export function createRole(api: API, assoId: string, name: string) {
  return api.post<CreateRoleRequest, CreatedRole>(`/assos/${assoId}/roles`, {
    name,
  });
}
