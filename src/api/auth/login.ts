export interface LoginRequestDto {
  login: string;
  password: string;
  tokenExpiresIn: number;
}

export interface LoginResponseDto {
  signedIn: boolean;
  token: string;
  redirectUrl: string;
}
