export interface CasLoginRequestDto {
  ticket: string;
  tokenExpiresIn: number;
}

export interface CasLoginResponseDto {
  status: 'no_account' | 'no_api_key' | 'ok';
  token: string | null;
  redirectUrl: string | null;
}
