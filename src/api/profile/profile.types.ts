import { UserType } from '@/module/user';

export interface Profile {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  studentId: number;
  sex: string;
  nickname: string;
  passions: string;
  website: string;
  birthday: Date;
  type: UserType;
}
