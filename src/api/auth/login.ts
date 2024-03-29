export interface LoginRequestDto {
  login: string;
  password: string;
}

export interface LoginResponseDto {
  access_token: string;
}
