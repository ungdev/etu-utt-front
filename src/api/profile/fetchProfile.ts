import { API } from '@/api/api';
import { Profile } from '@/api/profile/profile.types';

export function fetchProfile(api: API) {
  return api.get<Profile>('/profile');
}
