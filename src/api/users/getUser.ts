import { useEffect, useState } from 'react';
import { useAPI } from '@/api/api';
import { StatusCodes } from 'http-status-codes';
import { User } from '@/api/users/user.interface';

export function useUser(userId: string): User | null {
  const [user, setUser] = useState<User | null>(null);
  const api = useAPI();
  useEffect(() => {
    api.get<User>(`/users/${userId}`).on(StatusCodes.OK, setUser);
  }, [userId]);
  return user;
}
