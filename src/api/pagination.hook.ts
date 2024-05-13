import { useState, useRef } from 'react';
import { useAPI } from './api';
import { Pagination } from './api.interface';

type PaginationHook<T> = {
  items: T[];
  total: number;
  isLoading: boolean;
  updateFilters: (query: Record<string, string>) => void;
  fetchNextItems: () => void;
};

/**
 * Use this hook to load paginated data for a `ResultsList`
 */
export function usePaginationLoader<T>(path: string): PaginationHook<T> {
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [isSearching, setSearching] = useState(false);
  const lastSearch = useRef<Record<string, string>>({});
  const pageIndex = useRef(1);

  const api = useAPI();

  const updateItems = (query: Record<string, string>) => {
    if (isSearching) return;
    else setSearching(true);

    const { page, ...queryData } = query;
    api
      .get<Pagination<T>>(`${path}?${new URLSearchParams(query)}`)
      .on('success', (body) => {
        setTotal(body.itemCount);
        setItems(body.items);
        lastSearch.current = queryData;
        setSearching(false);
        pageIndex.current = (page && Number(page)) || 1;
      })
      .on('error', () => setSearching(false))
      .on('failure', () => setSearching(false));
  };

  const fetchNextPage = () => {
    if (isSearching || items.length >= total) return;
    else setSearching(true);

    api
      .get<Pagination<T>>(
        `${path}?${new URLSearchParams({ ...lastSearch.current, page: String(pageIndex.current + 1) })}`,
      )
      .on('success', (body) => {
        pageIndex.current++;
        setTotal(body.itemCount);
        setItems((prev) => [...prev, ...body.items]);
        setSearching(false);
      })
      .on('error', () => setSearching(false))
      .on('failure', () => setSearching(false));
  };
  return { items, total, isLoading: isSearching, updateFilters: updateItems, fetchNextItems: fetchNextPage };
}
