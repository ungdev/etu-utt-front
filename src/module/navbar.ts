import { MenuItem } from '@/components/Navbar';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from 'src/lib/store';
import Icons from '@/icons';
import { CookieNames, setCookie } from '@/module/cookies';

export const userSlice = createSlice({
  name: 'navbar',
  reducers: {
    addItem: (
      state,
      action: PayloadAction<{ item: MenuItem; parents: string; before: string | null; after: string | null }>,
    ) => {
      const location = action.payload.parents.split(',');
      let list: MenuItem<boolean>[] | null = state.items;
      for (let i = 0; i < (action.payload.parents.length > 0 ? location.length : 0); i++) {
        const index: number = list.findIndex(({ name, submenus }) => name === location[i] && submenus != null);
        if (index < 0) {
          return;
        }
        list = list[index].submenus!;
      }
      if (list.findIndex(({ name }) => name === action.payload.item.name) >= 0) return; // an item already has this name
      if (action.payload.before != null) {
        let index = list.findIndex(({ name }) => name === action.payload.before);
        if (index < 0) index = list.length;
        list.splice(index, 0, action.payload.item);
      } else if (action.payload.after != null) {
        let index = list.findIndex(({ name }) => name === action.payload.after);
        if (index < 0) index = list.length - 1;
        list.splice(index + 1, 0, action.payload.item);
      } else list.push(action.payload.item);
    },
    replaceItem: (state, action: PayloadAction<{ item: MenuItem; search: string[] }>) => {
      let list: MenuItem<boolean>[] | null = state.items;
      for (let i = 0; i < action.payload.search.length - 1; i++) {
        const index: number = list.findIndex(
          ({ name, submenus }) => name === action.payload.search[i] && submenus != null,
        );
        if (index < 0) {
          return;
        }
        list = list[index].submenus!;
      }
      const index = list.findIndex(({ name }) => name === action.payload.search[action.payload.search.length - 1]);
      const duplicateCheckIndex = list.findIndex(({ name }) => name === action.payload.item.name);
      if (duplicateCheckIndex >= 0 && duplicateCheckIndex != index) return; // an other item already has this name
      if (index >= 0) list.splice(index, 1, action.payload.item);
    },
    removeItem: (state, action: PayloadAction<string[]>) => {
      let list: MenuItem<boolean>[] | null = state.items;
      for (let i = 0; i < action.payload.length - 1; i++) {
        const index: number = list.findIndex(({ name, submenus }) => name === action.payload[i] && submenus != null);
        if (index < 0) {
          return;
        }
        list = list[index].submenus!;
      }
      const index = list.findIndex(({ name }) => name === action.payload[action.payload.length - 1]);
      if (index >= 0) list.splice(index, 1);
    },
    moveSeparator: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload <= state.items.length) state.seperator = action.payload;
    },
  },
  initialState: <{ items: MenuItem[]; seperator: number }>{
    items: [
      {
        icon: Icons.Home,
        name: 'common:navbar.home',
        path: '/',
        translate: true,
        needLogin: false,
      },
      {
        icon: Icons.User,
        name: 'common:navbar.userBrowser',
        path: '/users',
        translate: true,
        needLogin: true,
      },
      {
        icon: Icons.Book,
        name: 'common:navbar.uesBrowser',
        path: '/ues',
        translate: true,
        needLogin: false,
      },
      {
        icon: Icons.Users,
        name: 'common:navbar.associations',
        path: '/assos',
        translate: true,
        needLogin: false,
      },
      {
        icon: Icons.Caret,
        name: 'common:navbar.myUEs',
        translate: true,
        needLogin: true,
        submenus: [
          {
            name: 'IF01',
            path: '/ue/if01',
          },
          {
            name: 'SY04',
            path: '/ue/sy04',
          },
          {
            name: 'RE14',
            path: '/ue/re14',
          },
          {
            name: 'LO14',
            path: '/ue/lo14',
          },
        ],
      },
      {
        icon: Icons.Caret,
        name: 'common:navbar.myAssociations',
        translate: true,
        needLogin: true,
        submenus: [
          {
            name: 'UNG',
            path: '/assos/ung',
          },
          {
            name: 'BDE',
            path: '/assos/bde',
          },
        ],
      },
    ],
    seperator: 4,
  },
});

const { addItem, replaceItem, removeItem, moveSeparator } = userSlice.actions;

export const addMenuItem =
  (
    item: MenuItem,
    options?: {
      parents?: string;
      before?: string;
      after?: string;
    },
  ): AppThunk =>
  (dispatch) => {
    dispatch(
      addItem({
        item,
        parents: options?.parents ?? '',
        before: options?.before || null,
        after: options?.after || null,
      }),
    );
  };

export const replaceMenuItem =
  (item: MenuItem, ...replacedItemName: string[]): AppThunk =>
  (dispatch) => {
    dispatch(replaceItem({ item, search: replacedItemName }));
  };

export const removeMenuItem =
  (...pathToItem: string[]): AppThunk =>
  (dispatch) => {
    dispatch(removeItem(pathToItem));
  };

export const getMenuItem = (...pathToItem: string[]): AppThunk<MenuItem | null> => (_, state) => {
  let list: MenuItem[] | null = state().navbar.items;
  for (let i = 0; i < pathToItem.length - 1; i++) {
    const index: number = list.findIndex(
      ({ name, submenus }) => name === pathToItem[i] && submenus != null,
    );
    if (index < 0) {
      return null;
    }
    list = list[index].submenus!;
  }
  const index = list.findIndex(({ name }) => name === pathToItem[pathToItem.length - 1]);
  if (index < 0) {
    return null;
  }
  return list[index];
};

export const setAlwaysVisibleCount =
  (count: number): AppThunk =>
  (dispatch) => {
    dispatch(moveSeparator(count));
  };

export const getMenu = (state: RootState) => state.navbar;

export const setCollapsed =
  (collapse: boolean): AppThunk =>
  (dispatch) => {
    dispatch(setCookie(CookieNames.NAVBAR_COLLAPSED, collapse ? 'true' : 'false'));
  };

export default userSlice.reducer;
