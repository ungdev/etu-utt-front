import { API } from '@/api/api';
import { UploadImageResponse } from '@/api/media/media.interface';

export function uploadPublicImage(
  api: API,
  file: File,
  { public_ = true, preset = null }: { public_?: boolean; preset?: 'AVATAR' | null },
): Promise<UploadImageResponse | undefined> {
  const formData = new FormData();
  formData.append('file', file);
  return api
    .post<
      FormData,
      UploadImageResponse
    >(`/media/image?${new URLSearchParams({ public: public_ ? 'true' : 'false', ...(preset ? { preset } : {}) }).toString()}`, formData, { isFile: true })
    .toPromise();
}
