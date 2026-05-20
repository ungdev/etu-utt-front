export interface RegisterRequestDto {
  firstName: string;
  lastName: string;
  login: string;
  mail: string;
  tokenExpiresIn: number;
}

export interface RegisterResponseDto {
  signedIn: boolean;
  token: string;
  redirectUrl: string;
}
