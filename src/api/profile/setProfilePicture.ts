import { API } from '@/api/api';

export function setProfilePicture(api: API, file: File) {
  const data = new FormData();
  data.append('file', file);
  data.append('user', 'hubot');
  console.log(file);
  /*return fetch('http://localhost:3000/v1/profile/avatar', {
    method: 'PATCH',
    body: data,
    headers: { Authorization: `Bearer ${localStorage.getItem('etuutt-token')}` },
  });*/
  return api.patch('/profile/avatar', data, { isFile: true }).toPromise();
}
