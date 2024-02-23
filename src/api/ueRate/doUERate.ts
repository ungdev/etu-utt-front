import { API, handleAPIResponse } from '@/api/api';
import { StatusCodes } from 'http-status-codes';
import { UERate } from '@/api/ueRate/ueRateCriterion.interface';

interface DoUERateRequestDto {
  criterion: string;
  value: number;
}

export default async function doUERate(ueCode: string, criterion: string, value: number): Promise<UERate | null> {
  const res = await API.put<DoUERateRequestDto, UERate>(`ue/${ueCode}/rate`, { criterion, value });
  return handleAPIResponse(res, {
    [StatusCodes.OK]: (body) => body,
  });
}
