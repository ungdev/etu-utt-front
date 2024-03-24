import { API } from '@/api/api';
import { UERate } from '@/api/ueRate/ueRateCriterion.interface';

interface DoUERateRequestDto {
  criterion: string;
  value: number;
}

export default function doUERate(api: API, ueCode: string, criterion: string, value: number) {
  return api.put<DoUERateRequestDto, UERate>(`ue/${ueCode}/rate`, { criterion, value });
}
