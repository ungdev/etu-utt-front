import { useEffect, useState } from 'react';
import { API, handleAPIResponse, ResponseDto } from '@/api/api';
import { StatusCodes } from 'http-status-codes';

interface UE {
  code: string;
  inscriptionCode: string;
  name: string;
  credits: {
    credits: number;
    category: {
      code: string;
      name: string;
    };
  };
  branchOption: {
    branch: {
      code: string;
      name: string;
    };
    code: string;
    name: string;
  };
  info: {
    requirements: {
      code: string;
    }[];
    comment: string;
    degree: string;
    languages: string;
    minors: string;
    objectives: string;
    program: string;
  };
  openSemester: Array<{
    code: string;
    start: Date;
    end: Date;
  }>;
}

export interface SearchUEsResponseDto extends ResponseDto {
  items: UE[];
  itemsPerPage: number;
  itemCount: number;
}

export function useSearchUEs(): [UE[], (filters: Record<string, string>) => void] {
  const fetch = async (filters: Record<string, string>) => {
    const params = new URLSearchParams(filters).toString();
    const res = await API.get<SearchUEsResponseDto>(`/ue?${params}`);
    handleAPIResponse(res, {
      [StatusCodes.OK]: (body) => {
        setUEs(body.items);
      },
    });
  };
  const [ues, setUEs] = useState<UE[]>([]);
  useEffect(() => {
    fetch({});
  }, []);
  return [ues, fetch];
}
