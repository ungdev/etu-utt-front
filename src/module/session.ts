import { type Action, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '@/lib/store';
import { API } from '@/api/api';
import { LoginRequestDto, LoginResponseDto } from '@/api/auth/login';
import { StatusCodes } from 'http-status-codes';
import { RegisterRequestDto, RegisterResponseDto } from '@/api/auth/register';
import { IsLoggedInResponseDto } from '@/api/auth/isLoggedIn';

interface SessionSlice {
  logged: boolean;
  token: string;
}

export const sessionSlice = createSlice({
  name: 'session',
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => ({ ...state, logged: action.payload }),
    setToken: (state, action: PayloadAction<string>) => ({ ...state, token: action.payload }),
  },
  initialState: { logged: false } as SessionSlice,
});

const { setLoggedIn, setToken } = sessionSlice.actions;

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
        dispatch(setToken(res.body.access_token));
        break;
      default:
        console.error('Unknown status code : ' + res.code);
    }
  }) as unknown as Action;

export const autoLogin = () =>
  (async (dispatch: AppDispatch) => {
    const token = localStorage.getItem('etuutt-token');
    if (!token) {
      return;
    }
    const res = await API.get<IsLoggedInResponseDto>('/auth/signin');
    if (res.error !== 'no-error') {
      return;
    }
    switch (res.code) {
      case StatusCodes.OK:
        if (res.body.valid) {
          dispatch(setLoggedIn(true));
          dispatch(setToken(token));
        }
        break;
      default:
        console.error('Unknown status code : ' + res.code);
    }
  }) as unknown as Action;

export default sessionSlice.reducer;
