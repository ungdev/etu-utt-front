import { API } from '@/api/api';

export interface UpdateApplicationTokenRequestDto {
  expiresIn: number;
}

export default function updateApplicationToken(api: API, applicationId: string): Promise<string | undefined> {
  return api
    .patch<UpdateApplicationTokenRequestDto, { token: string }>(`auth/application/${applicationId}/token`, {
      expiresIn: 1000,
    })
    .on('success', (body) => body.token)
    .toPromise();
}
