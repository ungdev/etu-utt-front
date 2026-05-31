import { useState, useRef } from 'react';
import { Abortable, ResponseFailureReason, useAPI } from './api';
import { Pagination } from './api.interface';

export type PaginationHook<T> = {
  items: (T | null)[];
  total: number;
  updateFilters: (query: Record<string, string>, page?: number) => void;
  fetchNextItems: () => void;
  invalidateItems: () => void;
};

/**
 * Use this hook to load paginated data for a `ResultsList`
 */
export function usePaginationLoader<T>(path: string): PaginationHook<T> {
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const handler = useRef<Abortable | undefined>(undefined);
  const lastSearch = useRef<Record<string, string>>({});
  const itemsPerPage = useRef(0);
  const pageIndex = useRef(1);

  const api = useAPI();

  const invalidateItems = () => {
    setItems([...Array(itemsPerPage.current || 20).fill(null)]);
  };

  const updateItems = (query: Record<string, string>, page?: number) => {
    if (handler.current) handler.current.abort();

    setItems([...Array(itemsPerPage.current || 20).fill(null)]);
    const fullQuery = page ? { ...query, page: `${page}` } : query;
    handler.current = api
      .get<Pagination<T>>(`${path}?${new URLSearchParams(fullQuery)}`)
      .on('success', (body) => {
        setTotal(body.itemCount);
        setItems(body.items);
        itemsPerPage.current = body.itemsPerPage;
        lastSearch.current = query;
        pageIndex.current = page || 1;
        handler.current = undefined;
      })
      .on('fallback', () => (handler.current = undefined))
      .on(ResponseFailureReason.aborted, () => {}); // Hide toast error here as we have aborted the request
  };

  const fetchNextPage = () => {
    if (handler.current) return;
    if (items.length >= total) return;

    const pendingItemCount = Math.min(itemsPerPage.current, total - items.length);
    setItems((prev) => [...prev, ...Array(pendingItemCount).fill(null)]);
    handler.current = api
      .get<Pagination<T>>(
        `${path}?${new URLSearchParams({ ...lastSearch.current, page: String(pageIndex.current + 1) })}`,
      )
      .on('success', (body) => {
        pageIndex.current++;
        setTotal(body.itemCount);
        setItems((prev) => [...prev.slice(0, prev.length - pendingItemCount), ...body.items]);
        handler.current = undefined;
      })
      .on('fallback', () => (handler.current = undefined))
      .on(ResponseFailureReason.timeout, () => {}); // Hide toast error here as we might have aborted the request
  };
  return {
    items,
    total,
    updateFilters: updateItems,
    fetchNextItems: fetchNextPage,
    invalidateItems,
  };
}
