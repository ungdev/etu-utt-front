import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from '@/lib/hooks';

export const enum UserType {
  STUDENT = 'STUDENT',
  FORMER_STUDENT = 'FORMER_STUDENT',
  TEACHER = 'TEACHER',
  EMPLOYEE = 'EMPLOYEE',
  OTHER = 'OTHER',
}

interface UserSlice {
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

export const userSlice = createSlice({
  name: 'user',
  reducers: {
    setUser: (state, action: PayloadAction<UserSlice | null>) => action.payload,
  },
  initialState: null as UserSlice | null,
});

export const { setUser } = userSlice.actions;

export const useConnectedUser = () => useAppSelector((state) => state.user);

export default userSlice.reducer;
