import { useState } from 'react';
import { useAPI } from '@/api/api';
import { User } from '@/api/users/user.interface';
import { Pagination } from '@/api/api.interface';

export function useUsers(): [User[], number, (query: Record<string, string>) => void] {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const api = useAPI();
  const updateUsers = async (query: Record<string, string>) =>
    api.get<Pagination<User>>(`/users?${new URLSearchParams(query)}`).on('success', (body) => {
      setUsers(body.items);
      setTotal(body.itemCount);
    });
  return [users, total, updateUsers];
}
