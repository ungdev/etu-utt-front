import { type Action, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '@/lib/store';
import { API } from '@/api/api';
import { LoginRequestDto, LoginResponseDto } from '@/api/auth/login';
import { StatusCodes } from 'http-status-codes';
import { RegisterRequestDto, RegisterResponseDto } from '@/api/auth/register';

interface SessionSlice {
  logged: boolean;
}

export const sessionSlice = createSlice({
  name: 'session',
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => ({ ...state, logged: action.payload }),
  },
  initialState: { logged: false } as SessionSlice,
});

const { setLoggedIn } = sessionSlice.actions;

export const login = (login: string, password: string) =>
  (async (dispatch: AppDispatch) => {
    const res = await API.post<LoginRequestDto, LoginResponseDto>('/auth/signin', { login, password });
    if (res.error !== 'no-error') {
      console.log('oupsy, une erreur');
      console.log(res.error);
      return;
    }
    switch (res.code) {
      case StatusCodes.OK:
        dispatch(setLoggedIn(true));
        break;
      default:
        console.error('Unknown status code : ' + res.code);
    }
  }) as unknown as Action;

export const register = (lastName: string, firstName: string, login: string, password: string) =>
  (async (dispatch: AppDispatch) => {
    const res = await API.post<RegisterRequestDto, RegisterResponseDto>('/auth/signup', {
      lastName,
      firstName,
      login,
      password,
      sex: 'OTHER',
      birthday: new Date(2003, 1, 28),
    });
    if (res.error !== 'no-error') {
      return;
    }
    switch (res.code) {
      case StatusCodes.OK:
        dispatch(setLoggedIn(true));
        break;
      default:
        console.error('Unknown status code : ' + res.code);
    }
  }) as unknown as Action;

export default sessionSlice.reducer;
