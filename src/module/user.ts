import { type Action, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from 'src/lib/store';
import { useAppSelector } from '@/lib/hooks';
import { fetchProfile } from '@/api/profile/fetchProfile';

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

const { setUser } = userSlice.actions;

export const fetchUser = () =>
  (async (dispatch: AppDispatch) => dispatch(setUser((await fetchProfile()) ?? null))) as unknown as Action;

export const useConnectedUser = () => useAppSelector((state) => state.user);

export default userSlice.reducer;
