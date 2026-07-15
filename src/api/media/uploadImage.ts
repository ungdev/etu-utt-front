import { API } from '@/api/api';
import { UploadImageResponse } from '@/api/media/media.interface';

export function uploadPublicImage(api: API, file: File): Promise<UploadImageResponse | undefined> {
  const formData = new FormData();
  formData.append('file', file);
  return api.post<FormData, UploadImageResponse>('/media/image?public=true', formData, { isFile: true }).toPromise();
}
