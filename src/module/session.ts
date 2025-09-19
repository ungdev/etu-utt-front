import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '@/lib/store';
import { LoginRequestDto, LoginResponseDto } from '@/api/auth/login';
import { StatusCodes } from 'http-status-codes';
import { RegisterRequestDto, RegisterResponseDto } from '@/api/auth/register';
import { IsLoggedInResponseDto } from '@/api/auth/isLoggedIn';
import { setUser } from '@/module/user';
import { API, setAuthorizationToken } from '@/api/api';
import { fetchProfile } from '@/api/profile/fetchProfile';
import { LocalStorageNames } from '@/global';

interface SessionSlice {
  logged: boolean;
  token: string | null;
}

export const sessionSlice = createSlice({
  name: 'session',
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      setAuthorizationToken(action.payload ?? '');
      localStorage.setItem(LocalStorageNames.TOKEN, action.payload ?? '');
      state.token = action.payload;
      state.logged = !!action.payload;
    },
  },
  initialState: { logged: false, token: null } as SessionSlice,
});

const { setToken: _setToken } = sessionSlice.actions;

export const login =
  (api: API, login: string, password: string): AppThunk =>
  (dispatch) =>
    api
      .post<LoginRequestDto, LoginResponseDto>('/auth/signin', { login, password })
      .on('success', async (body) => dispatch(setToken(body.access_token, api)))
      .on(StatusCodes.UNAUTHORIZED, (body) => console.error('Wrong credentials', body))
      .on(StatusCodes.BAD_REQUEST, (body) => console.error('Bad request', body));

export const register =
  (api: API, lastName: string, firstName: string, login: string, password: string): AppThunk =>
  async (dispatch) =>
    api
      .post<RegisterRequestDto, RegisterResponseDto>('/auth/signup', {
        lastName,
        firstName,
        login,
        password,
        sex: 'OTHER',
        type: 'STUDENT',
        birthday: new Date(2003, 1, 28),
      })
      .on('success', (body) => dispatch(setToken(body.access_token, api)));

export const logout = (): AppThunk => (dispatch) => dispatch(setToken(null));

export const isLoggedIn = (state: RootState) => state.session.logged;

export const autoLogin =
  (api: API): AppThunk =>
  async (dispatch) => {
    const token = localStorage.getItem(LocalStorageNames.TOKEN);
    if (!token) {
      return;
    }
    setAuthorizationToken(token);
    api.get<IsLoggedInResponseDto>('/auth/signin').on('success', async (body) => {
      if (body.valid) {
        dispatch(setToken(token, api));
      }
    });
  };

export function setToken(token: null): AppThunk;
export function setToken(token: string, api: API): AppThunk;
export function setToken(token: string | null, api?: API): AppThunk {
  return async (dispatch) => {
    dispatch(_setToken(token));
    if (token === null) {
      setUser(null);
      return;
    }
    const user = await fetchProfile(api!).toPromise();
    dispatch(setUser(user ?? null));
  };
}

export default sessionSlice.reducer;
