import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAPI } from '@/api/api';
import { ApplicationOverview } from '@/api/auth/applications/application.interface';
import { useConnectedUser } from '@/module/user';

export default function useApplications(): [
  ApplicationOverview[] | undefined,
  Dispatch<SetStateAction<ApplicationOverview[] | undefined>>,
] {
  const loggedIn = !!useConnectedUser();
  const [applications, setApplications] = useState<ApplicationOverview[] | undefined>(undefined);
  const api = useAPI();
  useEffect(() => {
    if (!loggedIn) return;
    api.get<ApplicationOverview[]>('auth/application').on('success', (body) => setApplications(body));
  }, [loggedIn]);
  return [applications, setApplications];
}
