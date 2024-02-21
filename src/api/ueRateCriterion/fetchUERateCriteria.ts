import { API, handleAPIResponse } from '@/api/api';
import { StatusCodes } from 'http-status-codes';
import { UERateCriterion } from '@/api/ueRateCriterion/ueRateCriterion.interface';

export default async function fetchUERateCriteria(): Promise<UERateCriterion[] | null> {
  const res = await API.get<UERateCriterion[]>('ue/rate/criteria');
  return handleAPIResponse(res, {
    [StatusCodes.OK]: (body) => body,
  });
}
