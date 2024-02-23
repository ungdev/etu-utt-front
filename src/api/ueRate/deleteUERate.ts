import { API, handleAPIResponse } from '@/api/api';
import { UERate } from '@/api/ueRate/ueRateCriterion.interface';
import { StatusCodes } from 'http-status-codes';

export default async function deleteUERate(ueCode: string, criterion: string): Promise<boolean> {
  const res = await API.delete<UERate>(`ue/${ueCode}/rate/${criterion}`);
  return (
    handleAPIResponse(res, {
      [StatusCodes.OK]: () => true,
    }) ?? false
  );
}
