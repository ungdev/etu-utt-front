import { type Action, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '@/lib/store';
import { API, handleAPIResponse } from '@/api/api';
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
    handleAPIResponse(res, {
      [StatusCodes.OK]: () => dispatch(setLoggedIn(true)),
    });
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
    handleAPIResponse(res, {
      [StatusCodes.OK]: (body) => {
        dispatch(setLoggedIn(true));
        dispatch(setToken(body.access_token));
      },
    });
  }) as unknown as Action;

export const autoLogin = () =>
  (async (dispatch: AppDispatch) => {
    const token = localStorage.getItem('etuutt-token');
    if (!token) {
      return;
    }
    const res = await API.get<IsLoggedInResponseDto>('/auth/signin');
    handleAPIResponse(res, {
      [StatusCodes.OK]: (body) => {
        if (body.valid) {
          dispatch(setLoggedIn(true));
          dispatch(setToken(token));
        }
      },
    });
  }) as unknown as Action;

export default sessionSlice.reducer;
