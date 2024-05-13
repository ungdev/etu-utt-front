import { UE } from '@/api/ue/ue.interface';
import { usePaginationLoader } from '../pagination.hook';

export function useUEs() {
  return usePaginationLoader<UE>('/ue');
}
