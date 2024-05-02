import { User } from '@/api/users/user.interface';
import { usePaginationLoader } from '../pagination.hook';

export function useUsers() {
  return usePaginationLoader<User>('/users');
}
