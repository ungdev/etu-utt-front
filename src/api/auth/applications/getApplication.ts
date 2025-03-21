import { useAPI } from '@/api/api';
import { ApplicationOverview } from '@/api/auth/applications/application.interface';
import { useEffect, useState } from 'react';
import { StatusCodes } from 'http-status-codes';

export default function useApplication(applicationId: string | undefined) {
  const [application, setApplication] = useState<ApplicationOverview | undefined>(undefined);
  const api = useAPI();
  useEffect(() => {
    setApplication(undefined);
    if (!applicationId) return;
    api.get<ApplicationOverview>(`auth/application/${applicationId}`).on(StatusCodes.OK, setApplication);
  }, [applicationId]);
  return application;
}
