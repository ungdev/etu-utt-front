import { API } from '@/api/api';

export interface UpdateApplicationTokenRequestDto {
  expiresIn: number;
}

export async function updateApplicationToken(api: API, applicationId: string): Promise<string | null> {
  return api
    .patch<UpdateApplicationTokenRequestDto, { token: string }>(`auth/application/${applicationId}/token`, {
      expiresIn: 1000,
    })
    .on('success', (body) => body.token)
    .toPromise()
    .then((result) => result ?? null);
}
