import { useEffect, useState } from 'react';
import { useAPI } from '@/api/api';
import { User } from '@/api/users/user.interface';

export default function useTodaysBirthdays(): User[] | null {
  const [users, setUsers] = useState<User[] | null>(null);
  const api = useAPI();
  useEffect(() => {
    api.get<User[]>('/users/birthdays/today').on('success', setUsers);
  }, []);
  return users;
}
