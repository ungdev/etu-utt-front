import { AssoOverview } from '@/api/assos/asso.interface';
import { PaginationHook, usePaginationLoader } from '@/api/pagination.hook';

export function useAssos(): PaginationHook<AssoOverview> {
  return usePaginationLoader<AssoOverview>('/assos');
}
