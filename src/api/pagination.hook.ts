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
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const searching = useRef(false);
  const lastSearch = useRef<Record<string, string>>({});
  const itemsPerPage = useRef(0);
  const pageIndex = useRef(1);

  const api = useAPI();

  const updateItems = (query: Record<string, string>) => {
    searching.current = true;

    setItems([...Array(itemsPerPage.current || 20).fill(null)]);
    const { page, ...queryData } = query;
    if (abortController?.signal?.aborted === false) abortController.abort('query-update');
    setAbortController(
      api
        .get<Pagination<T>>(`${path}?${new URLSearchParams(query)}`)
        .on('success', (body) => {
          setTotal(body.itemCount);
          setItems(body.items);
          itemsPerPage.current = body.itemsPerPage;
          lastSearch.current = queryData;
          searching.current = false;
          pageIndex.current = (page && Number(page)) || 1;
        })
        .on('error', () => (searching.current = false))
        .on('failure', () => (searching.current = false)).abortController,
    );
  };

  const fetchNextPage = () => {
    if (searching.current || items.length >= total) return;
    else searching.current = true;

    const pendingItemCount = Math.min(itemsPerPage.current, total - items.length);
    setItems((prev) => [...prev, ...Array(pendingItemCount).fill(null)]);
    setAbortController(
      api
        .get<Pagination<T>>(
          `${path}?${new URLSearchParams({ ...lastSearch.current, page: String(pageIndex.current + 1) })}`,
        )
        .on('success', (body) => {
          pageIndex.current++;
          setTotal(body.itemCount);
          setItems((prev) => [...prev.slice(0, prev.length - pendingItemCount), ...body.items]);
          searching.current = false;
        })
        .on('error', () => (searching.current = false))
        .on('failure', () => (searching.current = false)).abortController,
    );
  };
  return { items, total, updateFilters: updateItems, fetchNextItems: fetchNextPage };
}
