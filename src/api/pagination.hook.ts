import { useState, useRef } from 'react';
import { useAPI } from './api';
import { Pagination } from './api.interface';

type PaginationHook<T> = {
  items: (T | null)[];
  total: number;
  updateFilters: (query: Record<string, string>) => void;
  fetchNextItems: () => void;
};

/**
 * Use this hook to load paginated data for a `ResultsList`
 */
export function usePaginationLoader<T>(path: string): PaginationHook<T> {
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const onUpdate = useRef<Promise<void>>();
  const lastSearch = useRef<Record<string, string>>({});
  const itemsPerPage = useRef(0);
  const pageIndex = useRef(1);

  const api = useAPI();

  const updateItems = (query: Record<string, string>) => {
    let resolvePromise: () => void;
    if (onUpdate.current) {
      onUpdate.current.then(() => updateItems(query));
      return;
    } else onUpdate.current = new Promise((res) => (resolvePromise = res));

    setItems([...Array(itemsPerPage.current || 20).fill(null)]);
    const { page, ...queryData } = query;
    api
      .get<Pagination<T>>(`${path}?${new URLSearchParams(query)}`)
      .on('success', (body) => {
        setTotal(body.itemCount);
        setItems(body.items);
        itemsPerPage.current = body.itemsPerPage;
        lastSearch.current = queryData;
        pageIndex.current = (page && Number(page)) || 1;
        delete onUpdate.current;
        resolvePromise();
      })
      .on('error', () => (delete onUpdate.current, resolvePromise()))
      .on('failure', () => (delete onUpdate.current, resolvePromise()));
  };

  const fetchNextPage = () => {
    let resolvePromise: () => void;
    if (onUpdate.current) return;
    else onUpdate.current = new Promise((res) => (resolvePromise = res));

    const pendingItemCount = Math.min(itemsPerPage.current, total - items.length);
    setItems((prev) => [...prev, ...Array(pendingItemCount).fill(null)]);
    api
      .get<Pagination<T>>(
        `${path}?${new URLSearchParams({ ...lastSearch.current, page: String(pageIndex.current + 1) })}`,
      )
      .on('success', (body) => {
        pageIndex.current++;
        setTotal(body.itemCount);
        setItems((prev) => [...prev.slice(0, prev.length - pendingItemCount), ...body.items]);
        delete onUpdate.current;
        resolvePromise();
      })
      .on('error', () => (delete onUpdate.current, resolvePromise()))
      .on('failure', () => (delete onUpdate.current, resolvePromise()));
  };
  return { items, total, updateFilters: updateItems, fetchNextItems: fetchNextPage };
}
