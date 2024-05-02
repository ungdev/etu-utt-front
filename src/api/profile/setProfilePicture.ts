import { API } from '@/api/api';

export function setProfilePicture(api: API, file: File) {
  const data = new FormData();
  data.append('file', file);
  return api.patch('/profile/avatar', data, { isFile: true }).toPromise();
}
