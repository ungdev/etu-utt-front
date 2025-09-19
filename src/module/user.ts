import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from '@/lib/hooks';
import { AppThunk } from '@/lib/store';
import { addMenuItem, getMenuItem, removeMenuItem } from '@/module/navbar';
import { fetchMyUes } from '@/api/ue/fetchMyUes';
import { API } from '@/api/api';
import { MenuItem } from '@/components/Navbar';

export const enum UserType {
  STUDENT = 'STUDENT',
  FORMER_STUDENT = 'FORMER_STUDENT',
  TEACHER = 'TEACHER',
  EMPLOYEE = 'EMPLOYEE',
  OTHER = 'OTHER',
}

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
  type: UserType;
}

export const userSlice = createSlice({
  name: 'user',
  reducers: {
    setUser: (state, action: PayloadAction<UserSlice | null>) => action.payload,
  },
  initialState: null as UserSlice | null,
});

const { setUser: _setUser } = userSlice.actions;

export function setUser(user: null): AppThunk;
export function setUser(user: UserSlice, api: API): AppThunk;
export function setUser(user: UserSlice | null, api?: API): AppThunk {
  return async (dispatch) => {
    dispatch(_setUser(user));
    const menuItem = dispatch(getMenuItem('common:navbar.myUEs'));
    if (!menuItem || !menuItem.submenus) {
      console.error('Cannot find the menu item "common:navbar.myUEs"');
      return;
    }
    for (const submenu of menuItem.submenus) {
      dispatch(removeMenuItem('common:navbar.myUEs', submenu.name));
    }
    if (!user) {
      return;
    }
    const ues = await fetchMyUes(api!);
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

export const useConnectedUser = () => useAppSelector((state) => state.user);

export default userSlice.reducer;
