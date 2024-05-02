import { useRef, useState } from 'react';
import { useAPI } from '@/api/api';
import { User } from '@/api/users/user.interface';
import { Pagination } from '@/api/api.interface';

type UseUsersHook = [User[], number, boolean, (query: Record<string, string>) => void, () => void];

export function useUsers(): UseUsersHook {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [isSearching, setSearching] = useState(false);
  const lastSearch = useRef<Record<string, string>>({});
  const pageIndex = useRef(1);

  const api = useAPI();

  const updateUsers = (query: Record<string, string>) => {
    if (isSearching) return;
    else setSearching(true);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page, ...queryData } = query;
    api
      .get<Pagination<User>>(`/users?${new URLSearchParams(query)}`)
      .on('success', (body) => {
        setTotal(body.itemCount);
        setUsers(body.items);
        lastSearch.current = queryData;
        setSearching(false);
        pageIndex.current = 1;
      })
      .on('error', () => setSearching(false))
      .on('failure', () => setSearching(false));
  };

  const fetchNextPage = () => {
    if (isSearching || users.length >= total) return;
    else setSearching(true);

    api
      .get<Pagination<User>>(
        `/users?${new URLSearchParams({ ...lastSearch.current, page: String(pageIndex.current + 1) })}`,
      )
      .on('success', (body) => {
        pageIndex.current++;
        setTotal(body.itemCount);
        setUsers((prev) => [...prev, ...body.items]);
        setSearching(false);
      })
      .on('error', () => setSearching(false))
      .on('failure', () => setSearching(false));
  };
  return [users, total, isSearching, updateUsers, fetchNextPage];
}
