import { API, handleAPIResponse, ResponseDto } from '@/api/api';
import { StatusCodes } from 'http-status-codes';
import { useEffect, useState } from 'react';

export interface DetailedUE {
  code: string;
  inscriptionCode: string;
  name: string;
  validationRate: number;
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
  workTime: {
    cm: number;
    td: number;
    tp: number;
    the: number;
    project: number;
    internship: number;
  };
  credits: Array<{
    credits: number;
    category: {
      code: string;
      name: string;
    };
  }>;
  branchOption: Array<{
    code: string;
    name: string;
    branch: {
      code: string;
      name: string;
    };
  }>;
  starVotes: {
    criterionId: string;
    createdAt: Date;
    value: number;
  };
}

export interface FetchUEResponseDto extends ResponseDto, DetailedUE {}

export default function useFetchUE(code: string): DetailedUE | null {
  const [ue, setUE] = useState<DetailedUE | null>(null);
  useEffect(() => {
    API.get<FetchUEResponseDto>(`/ue/${code}`).then((res) =>
      handleAPIResponse(res, {
        [StatusCodes.OK]: (body) => {
          setUE(body);
        },
      }),
    );
  }, []);
  return ue;
}
