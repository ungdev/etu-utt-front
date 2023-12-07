import { RequestDto, ResponseDto } from '@/api/api';

export interface LoginRequestDto extends RequestDto {
  login: string;
  password: string;
}

export interface LoginResponseDto extends ResponseDto {
  token: string;
}
