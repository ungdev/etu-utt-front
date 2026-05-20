export interface LoginRequestDto {
  login: string;
  tokenExpiresIn: number;
}

export interface LoginResponseDto {
  signedIn: boolean;
  token: string;
  redirectUrl: string;
}
