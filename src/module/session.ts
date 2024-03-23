import { type Action, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '@/lib/store';
import { LoginRequestDto, LoginResponseDto } from '@/api/auth/login';
import { StatusCodes } from 'http-status-codes';
import { RegisterRequestDto, RegisterResponseDto } from '@/api/auth/register';
import { IsLoggedInResponseDto } from '@/api/auth/isLoggedIn';
import { setUser } from '@/module/user';
import { API } from '@/api/api';
import { fetchProfile } from '@/api/profile/fetchProfile';

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

export const login = (api: API, login: string, password: string) =>
  ((dispatch: AppDispatch) =>
    api
      .post<LoginRequestDto, LoginResponseDto>('/auth/signin', { login, password })
      .on('success', async (body) => {
        dispatch(setToken(body.access_token));
        dispatch(setUser((await fetchProfile(api).toPromise()) ?? null));
      })
      .on(StatusCodes.UNAUTHORIZED, (body) => console.error('Wrong credentials', body))
      .on(StatusCodes.BAD_REQUEST, (body) => console.error('Bad request', body))) as unknown as Action;

export const register = (api: API, lastName: string, firstName: string, login: string, password: string) =>
  (async (dispatch: AppDispatch) =>
    api
      .post<RegisterRequestDto, RegisterResponseDto>('/auth/signup', {
        lastName,
        firstName,
        login,
        password,
        sex: 'OTHER',
        role: 'STUDENT',
        birthday: new Date(2003, 1, 28),
      })
      .on('success', (body) => dispatch(setToken(body.access_token)))) as unknown as Action;

export const autoLogin = (api: API) =>
  (async (dispatch: AppDispatch) => {
    const token = localStorage.getItem('etuutt-token');
    if (!token) {
      return;
    }
    api.get<IsLoggedInResponseDto>('/auth/signin').on('success', async (body) => {
      if (body.valid) {
        dispatch(setToken(token));
        dispatch(setUser((await fetchProfile(api).toPromise()) ?? null));
      }
    });
  }) as unknown as Action;

export default sessionSlice.reducer;
