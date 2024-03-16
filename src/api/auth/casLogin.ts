import { RequestDto, ResponseDto } from '@/api/api';

export interface CasLoginRequestDto extends RequestDto {
  ticket: string;
  service: string;
}

export interface CasLoginResponseDto extends ResponseDto {
  signedIn: boolean;
  access_token: string;
}
