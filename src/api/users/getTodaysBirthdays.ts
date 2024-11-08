import { useEffect, useState } from 'react';
import { useAPI } from '@/api/api';
import { User } from '@/api/users/user.interface';
import { useLoggedIn } from '@/module/session';

export default function useTodaysBirthdays(): User[] | null | undefined {
  const [users, setUsers] = useState<User[] | null | undefined>(undefined);
  const api = useAPI();
  const logged = useLoggedIn();
  useEffect(() => {
    if (logged && !users) {
      api.get<User[]>('/users/birthdays/today').on('success', setUsers);
    } else if (!logged) {
      setUsers(null);
    }
  }, []);
  return users;
}
