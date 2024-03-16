import { RequestDto, ResponseDto } from '@/api/api';

export interface CasRegisterRequestDto extends RequestDto {
  registerToken: string;
}
