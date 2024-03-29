export interface CasLoginRequestDto {
  ticket: string;
  service: string;
}

export interface CasLoginResponseDto {
  signedIn: boolean;
  access_token: string;
}
