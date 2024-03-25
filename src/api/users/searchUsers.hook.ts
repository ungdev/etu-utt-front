import { useState } from 'react';
import { useAPI } from '@/api/api';
import { User } from '@/api/users/user.interface';

export function useUsers(): [User[], (query: Record<string, string>) => void] {
  const [users, setUsers] = useState<User[]>([]);
  const api = useAPI();
  const updateUsers = async (query: Record<string, string>) =>
    api.get(`/users?${new URLSearchParams(query)}`).on('success', setUsers);
  return [users, updateUsers];
}
