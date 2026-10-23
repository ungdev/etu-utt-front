import { useEffect, useState } from 'react';
import { useAPI } from '@/api/api';
import { AnnalMetadata, AnnalType } from '@/api/annals/annal.interface';
import { useLoggedIn } from '@/module/session';

export default function useAnnalMetadata(
  code: string,
): [types: AnnalType[] | null | undefined, semesters: string[] | null | undefined] {
  const api = useAPI();
  const logged = useLoggedIn();
  const [availableTypes, setAvailableTypes] = useState<AnnalType[] | null | undefined>(logged ? undefined : null);
  const [availableSemesters, setAvailableSemesters] = useState<string[] | null | undefined>(logged ? undefined : null);

  useEffect(() => {
    if (logged && (!availableTypes || !availableSemesters))
      api.get<AnnalMetadata>(`/ue/annals/metadata?ueCode=${code}`).on('success', (metadata) => {
        setAvailableTypes(metadata.types);
        setAvailableSemesters(metadata.semesters);
      });
  }, [code, logged]);

  return [availableTypes, availableSemesters];
}
