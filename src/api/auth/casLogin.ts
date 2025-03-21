export interface CasLoginRequestDto {
  ticket: string;
  service: string;
}

export interface CasLoginResponseDto {
  signedIn: boolean;
  token: string;
}
