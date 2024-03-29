import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from '@/lib/hooks';

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
