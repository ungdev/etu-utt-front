import { API } from '@/api/api';
import { Role, RoleResponse, RoleUpdateRequest } from './member.interface';

export async function updateRole(
  api: API,
  assoId: string,
  roleId: string,
  position: number,
  name: string,
): Promise<Role[] | undefined> {
  const res = await api
    .put<RoleUpdateRequest, RoleResponse>(`/assos/${assoId}/roles/${roleId}`, {
      name,
      position,
    })
    .toPromise();
  return res?.roles;
}
