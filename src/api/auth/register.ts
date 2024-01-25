export interface RegisterRequestDto {
  firstName: string;
  lastName: string;
  login: string;
  password: string;
  role: 'STUDENT' | 'TEACHER' | 'EMPLOYEE';
  sex: 'MALE' | 'FEMALE' | 'OTHER';
  birthday: Date;
}

export interface RegisterResponseDto {
  access_token: string;
}
