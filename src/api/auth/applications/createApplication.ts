import { API } from '@/api/api';
import { ApplicationOverview } from '@/api/auth/applications/application.interface';

export interface CreateApplicationRequestDto {
  name: string;
  redirectUrl: string;
}

export default function createApplication(
  api: API,
  name: string,
  redirectUrl: string,
): Promise<ApplicationOverview | undefined> {
  return api
    .post<CreateApplicationRequestDto, ApplicationOverview>('auth/application', { name, redirectUrl })
    .toPromise() as Promise<ApplicationOverview | undefined>;
}
