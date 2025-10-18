import { API } from '@/api/api';

interface CreateApiKeyRequestDto {
  token: string;
}

interface CreateApiKeyResponseDto {
  redirectUrl: string;
}

export default function createApiKey(api: API, applicationId: string, token: string) {
  return api
    .post<CreateApiKeyRequestDto, CreateApiKeyResponseDto>('/auth/api-key', { token }, { applicationId })
    .on('success', (body) => body.redirectUrl)
    .toPromise();
}
