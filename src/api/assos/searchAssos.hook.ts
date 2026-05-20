import { Asso } from '@/api/assos/asso.interface';
import { PaginationHook, usePaginationLoader } from '@/api/pagination.hook';

export function useAssos(): PaginationHook<Asso> {
  return usePaginationLoader<Asso>('/assos');
}
