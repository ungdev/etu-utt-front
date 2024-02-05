import { ResponseDto } from '@/api/api';

export interface IsLoggedInResponseDto extends ResponseDto {
  valid: boolean;
}
