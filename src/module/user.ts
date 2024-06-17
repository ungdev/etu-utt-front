import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from '@/lib/hooks';
import { AppDispatch, AppThunk } from '@/lib/store';
import { addMenuItem, getMenuItem, removeMenuItem } from '@/module/navbar';
import Icons from '@/icons';
import { fetchMyUes } from '@/api/ue/fetchMyUes';
import { useAPI } from '@/api/api';
import { MenuItem } from '@/components/Navbar';

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

const { setUser: _setUser } = userSlice.actions;

export function setUser(user: UserSlice | null): AppThunk {
  return async (dispatch) => {
    dispatch(_setUser(user));
    const menuItem = dispatch(getMenuItem("common:navbar.myUEs"));
    if (!menuItem || !menuItem.submenus) {
      console.error('Cannot find the menu item "common:navbar.myUEs"');
      return;
    }
    for (const submenu of menuItem.submenus) {
      dispatch(removeMenuItem("common:navbar.myUEs", submenu.name));
    }
    if (!user) {
      return;
    }
    const ues = await fetchMyUes(useAPI());
    if (!ues) return;
    console.log(ues);
    ues.forEach((ue) => {
      dispatch(
        addMenuItem(
          { name: ue.code, path: `/ue/${ue.code}` } as MenuItem<false>,
          { parents: 'common:navbar.myUEs', before: undefined, after: undefined }
        ),
      );
    });
  };
}

export const useConnectedUser = () => useAppSelector((state) => state.user);

export default userSlice.reducer;
