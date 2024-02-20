import { type Action, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '@/lib/store';
import { API, handleAPIResponse } from '@/api/api';
import { LoginRequestDto, LoginResponseDto } from '@/api/auth/login';
import { StatusCodes } from 'http-status-codes';
import { RegisterRequestDto, RegisterResponseDto } from '@/api/auth/register';
import { IsLoggedInResponseDto } from '@/api/auth/isLoggedIn';
import { fetchUser } from '@/module/user';

interface SessionSlice {
  logged: boolean;
  token: string;
}

export const sessionSlice = createSlice({
  name: 'session',
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      localStorage.setItem('etuutt-token', action.payload);
      return { ...state, token: action.payload, logged: !!action.payload };
    },
  },
  initialState: { logged: false } as SessionSlice,
});

const { setToken } = sessionSlice.actions;

export const login = (login: string, password: string) =>
  (async (dispatch: AppDispatch) => {
    const res = await API.post<LoginRequestDto, LoginResponseDto>('/auth/signin', { login, password });
    handleAPIResponse(res, {
      [StatusCodes.OK]: (body) => {
        dispatch(setToken(body.access_token));
        dispatch(fetchUser());
      },
      [StatusCodes.UNAUTHORIZED]: (body) => console.error('Wrong credentials', body),
      [StatusCodes.BAD_REQUEST]: (body) => console.error('Bad request', body),
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
      role: 'STUDENT',
      birthday: new Date(2003, 1, 28),
    });
    handleAPIResponse(res, {
      [StatusCodes.CREATED]: (body) => dispatch(setToken(body.access_token)),
      [StatusCodes.CONFLICT]: (body) => console.error('User already exists', body),
      [StatusCodes.BAD_REQUEST]: (body) => console.error('Bad request', body),
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
          dispatch(setToken(token));
          dispatch(fetchUser());
        }
      },
    });
  }) as unknown as Action;

export default sessionSlice.reducer;
