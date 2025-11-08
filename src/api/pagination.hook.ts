import { useState, useRef } from 'react';
import { Abortable, ResponseFailureReason, useAPI } from './api';
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
  const handler = useRef<Abortable | undefined>(undefined);
  const lastSearch = useRef<Record<string, string>>({});
  const itemsPerPage = useRef(0);
  const pageIndex = useRef(1);

  const api = useAPI();

  const updateItems = (query: Record<string, string>) => {
    if (handler.current) handler.current.abort();

    setItems([...Array(itemsPerPage.current || 20).fill(null)]);
    const { page, ...queryData } = query;
    handler.current = api
      .get<Pagination<T>>(`${path}?${new URLSearchParams(query)}`)
      .on('success', (body) => {
        setTotal(body.itemCount);
        setItems(body.items);
        itemsPerPage.current = body.itemsPerPage;
        lastSearch.current = queryData;
        pageIndex.current = (page && Number(page)) || 1;
        delete handler.current;
      })
      .on('fallback', () => delete handler.current)
      .on(ResponseFailureReason.timeout, () => {}); // Hide toast error here as we might have aborted the request
  };

  const fetchNextPage = () => {
    if (handler.current) return;

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
        delete handler.current;
      })
      .on('fallback', () => delete handler.current)
      .on(ResponseFailureReason.timeout, () => {}); // Hide toast error here as we might have aborted the request
  };
  return { items, total, updateFilters: updateItems, fetchNextItems: fetchNextPage };
}
