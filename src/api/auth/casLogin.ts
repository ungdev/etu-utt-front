export interface CasLoginRequestDto {
  ticket: string;
  service: string;
}

export interface CasLoginResponseDto {
  status: 'no_account' | 'no_api_key' | 'ok';
  token: string;
  redirectUrl: string | null;
}
