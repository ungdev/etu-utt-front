import { useEffect, useState } from 'react';
import { useAPI } from '@/api/api';
import { User } from '@/api/users/user.interface';
import { useLoggedIn } from '@/module/session';

export default function useTodaysBirthdays(): User[] | null | undefined {
  const logged = useLoggedIn();
  const [users, setUsers] = useState<User[] | null | undefined>(logged ? undefined : null);
  const api = useAPI();

  useEffect(() => {
    if (logged && !users) api.get<User[]>('/users/birthdays/today').on('success', setUsers);
  }, [logged]);

  return users;
}
