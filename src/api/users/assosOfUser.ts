import { useEffect, useState } from 'react';
import { useAPI } from '@/api/api';
import { StatusCodes } from 'http-status-codes';
import { AssoMembership } from '@/api/users/user.interface';

export function useAssosOfUser(userId: string): AssoMembership[] {
  const [assos, setAssos] = useState<AssoMembership[]>([]);
  const api = useAPI();
  useEffect(() => {
    api.get<AssoMembership[]>(`/users/${userId}/associations`).on(StatusCodes.OK, setAssos);
  }, [userId]);
  return assos;
}
