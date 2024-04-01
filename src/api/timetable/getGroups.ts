import { useAPI } from '@/api/api';
import { useState } from 'react';

export function useGroups() {
  const api = useAPI();
  const [groups, setGroups] = useState<string[]>([]);
  /*useEffect(() => {
    api.get<string[]>('/timetable/groups/').on(StatusCodes.OK, setGroups);
  }, []);*/
  return groups;
}