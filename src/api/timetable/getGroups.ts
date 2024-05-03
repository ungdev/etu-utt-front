import { useAPI } from '@/api/api';
import { useEffect, useState } from 'react';
import { StatusCodes } from 'http-status-codes';

export function useGroups() {
  const api = useAPI();
  const [groups, setGroups] = useState<string[]>([]);
  useEffect(() => {
    api.get<string[]>('/timetable/current/groups/').on(StatusCodes.OK, setGroups);
  }, []);
  return groups;
}
