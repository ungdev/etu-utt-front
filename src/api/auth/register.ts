export interface RegisterRequestDto {
  firstName: string;
  lastName: string;
  login: string;
  password: string;
  type: 'STUDENT' | 'TEACHER' | 'EMPLOYEE';
  sex: 'MALE' | 'FEMALE' | 'OTHER';
  birthday: Date;
}

export interface RegisterResponseDto {
  token: string;
}
