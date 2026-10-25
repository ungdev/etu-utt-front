import { useAPI } from '@/api/api';
import { ApplicationOverview } from '@/api/auth/applications/application.interface';
import { useDeferredValue, useEffect, useState } from 'react';
import { StatusCodes } from 'http-status-codes';

export default function useApplication(applicationId: string | undefined): ApplicationOverview | undefined {
  const [application, setApplication] = useState<ApplicationOverview | undefined>(undefined);
  const deferredId = useDeferredValue(applicationId);
  const api = useAPI();

  if (deferredId !== applicationId) setApplication(undefined);

  useEffect(() => {
    if (!applicationId) return;
    api.get<ApplicationOverview>(`auth/application/${applicationId}`).on(StatusCodes.OK, setApplication);
  }, [applicationId]);
  return application;
}
