import { type Action, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from 'src/lib/store';

interface UserSlice {
  firstName: string;
  lastName: string;
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
  ((dispatch: AppDispatch) => {
    dispatch(setUser({ firstName: 'test', lastName: 'test' }));
  }) as unknown as Action;

export const getConnectedUser = (state: RootState) => state.user;

export default userSlice.reducer;
