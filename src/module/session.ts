import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '@/lib/store';
import { LoginRequestDto, LoginResponseDto } from '@/api/auth/login';
import { StatusCodes } from 'http-status-codes';
import { RegisterRequestDto, RegisterResponseDto } from '@/api/auth/register';
import { IsLoggedInResponseDto } from '@/api/auth/isLoggedIn';
import { API, setAuthorizationToken, useAPI } from '@/api/api';
import { fetchProfile } from '@/api/profile/fetchProfile';
import { useAppSelector } from '@/lib/hooks';
import { LocalStorageNames } from '@/global';
import { authorizationTokenExpiresIn } from '@/utils/environment';
import { fetchMyPermissions } from '@/api/permissions/fetchMyPermissions';
import { Permissions } from '@/api/permissions/permissions.interface';
import { Profile } from '@/api/profile/profile.types';
import { addMenuItem, getMenuItem, removeMenuItem } from '@/module/navbar';
import { fetchMyUes } from '@/api/ue/fetchMyUes';
import { MenuItem } from '@/components/Navbar';

export const enum UserType {
  STUDENT = 'STUDENT',
  FORMER_STUDENT = 'FORMER_STUDENT',
  TEACHER = 'TEACHER',
  EMPLOYEE = 'EMPLOYEE',
  OTHER = 'OTHER',
}

type LoggedInUser = Profile;

interface SessionSlice {
  logged: boolean;
  token: string | null;
  user: LoggedInUser | null;
  permissions: Permissions;
}

const initialState = {
  logged: false,
  token: null,
  permissions: { apiPermissions: [], userPermissions: [] },
  user: null,
} as SessionSlice;

export const sessionSlice = createSlice({
  name: 'session',
  reducers: {
    login: {
      prepare: (user: LoggedInUser, permissions: Permissions, token: string) => ({
        payload: { user, permissions, token },
      }),
      reducer: (_state, action: PayloadAction<{ user: LoggedInUser; permissions: Permissions; token: string }>) => ({
        ...action.payload,
        logged: true,
      }),
    },
    logout: () => initialState,
  },
  initialState,
});

const { login: loginReducer, logout: logoutReducer } = sessionSlice.actions;

export const login =
  (api: API, login: string, application?: string): AppThunk<Promise<LoginResponseDto | undefined>> =>
  (dispatch) =>
    api
      .post<LoginRequestDto, LoginResponseDto>(
        '/auth/signin',
        {
          login,
          tokenExpiresIn: authorizationTokenExpiresIn(),
        },
        { applicationId: application || undefined, version: 'vdev' },
      )
      .on('success', async (body) => {
        if (!body.signedIn) return body;
        if (body.token) dispatch(setToken(body.token, api));
        return body;
      })
      .on(StatusCodes.UNAUTHORIZED, (error) => console.error(`Wrong credentials (${error})`))
      .on(StatusCodes.BAD_REQUEST, (error) => console.error(`Bad request (${error})`))
      .toPromise();

export const register =
  (api: API, lastName: string, firstName: string, login: string, mail: string): AppThunk =>
  async (dispatch) =>
    api
      .post<RegisterRequestDto, RegisterResponseDto>(
        '/auth/signup',
        {
          lastName,
          firstName,
          login,
          mail,
          tokenExpiresIn: authorizationTokenExpiresIn(),
        },
        { version: 'vdev' },
      )
      .on('success', (body) => dispatch(setToken(body.token, api)));

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
    localStorage.setItem(LocalStorageNames.TOKEN, token ?? '');
    setAuthorizationToken(token ?? '');
    let loggedIn: boolean;
    if (token === null) {
      dispatch(logoutReducer());
      loggedIn = false;
    } else {
      const user = (await fetchProfile(api!).toPromise())!;
      const permissions = (await fetchMyPermissions(api!))!;
      loggedIn = user !== null;
      dispatch(loginReducer(user, permissions, token));
    }

    // Update navbar
    const menuItem = dispatch(getMenuItem('common:navbar.myUEs'));
    if (!menuItem || !menuItem.submenus) {
      console.error('Cannot find the menu item "common:navbar.myUEs"');
      return;
    }
    for (const submenu of menuItem.submenus) {
      dispatch(removeMenuItem('common:navbar.myUEs', submenu.name));
    }
    if (!loggedIn) return;
    const ues = await fetchMyUes(useAPI());
    if (!ues) return;
    ues.forEach((ue) => {
      dispatch(
        addMenuItem({ name: ue.code, path: `/ues/${ue.code}` } as MenuItem<false>, {
          parents: 'common:navbar.myUEs',
          before: undefined,
          after: undefined,
        }),
      );
    });
  };
}

export const useConnectedUser = () => useAppSelector((state) => state.session.user);

export const usePermissions = () => useAppSelector((state) => state.session.permissions);

export function useLoggedIn() {
  return useAppSelector((state) => state.session.logged);
}

export default sessionSlice.reducer;
