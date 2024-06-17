import { useEffect, useState } from 'react';
import { useAPI } from '@/api/api';
import { AnnalMetadata, AnnalType } from '@/api/annals/annal.interface';

export default function useAnnalMetadata(code: string): [types: AnnalType[] | null, semesters: string[] | null] {
  const [availableTypes, setAvailableTypes] = useState<AnnalType[] | null>(null);
  const [availableSemesters, setAvailableSemesters] = useState<string[] | null>(null);
  const api = useAPI();
  useEffect(() => {
    api.get<AnnalMetadata>(`/ue/annals/metadata?ueCode=${code}`).on('success', (metadata) => {
      setAvailableTypes(metadata.types);
      setAvailableSemesters(metadata.semesters);
    });
  }, []);
  return [availableTypes, availableSemesters];
}
