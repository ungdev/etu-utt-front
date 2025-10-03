import { useEffect, useState } from 'react';
import { useAPI } from '@/api/api';
import { Role, RoleResponse } from './member.interface';

export function useMembers(assoId: string): [Role[], (roles: Role[]) => void] {
  const [roles, setRoles] = useState<Role[]>([]);
  const api = useAPI();
  useEffect(() => {
    api.get<RoleResponse>(`/assos/${assoId}/members`).on('success', (body) => {
      setRoles(body.roles);
    });
  }, []);
  return [roles!, setRoles];
}
