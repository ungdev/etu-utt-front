import { MenuItem } from '@/components/Navbar';
import Book from '@/icons/Book';
import Caret from '@/icons/Caret';
import Home from '@/icons/Home';
import User from '@/icons/User';
import Users from '@/icons/Users';
import { type Action, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from 'src/lib/store';
import { isClientSide } from '@/utils/environment';

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
    replaceItem: (state, action: PayloadAction<{ item: MenuItem; search: string }>) => {
      const location = action.payload.search.split(',');
      let list: MenuItem<boolean>[] | null = state.items;
      for (let i = 0; i < location.length - 1; i++) {
        const index: number = list.findIndex(({ name, submenus }) => name === location[i] && submenus != null);
        if (index < 0) {
          return;
        }
        list = list[index].submenus!;
      }
      const index = list.findIndex(({ name }) => name === location[location.length - 1]);
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
    setCollapse: (state, action: PayloadAction<boolean>) => {
      localStorage.setItem('navbarCollapsed', `${action.payload}`);
      state.collapsed = action.payload;
    },
  },
  initialState: <{ items: MenuItem[]; seperator: number; collapsed: boolean }>{
    items: [
      {
        icon: Home,
        name: 'common:navbar.home',
        path: '/',
        translate: true,
      },
      {
        icon: User,
        name: 'common:navbar.userBrowser',
        path: '/users',
        translate: true,
      },
      {
        icon: Book,
        name: 'common:navbar.uesBrowser',
        path: '/ues',
        translate: true,
      },
      {
        icon: Users,
        name: 'common:navbar.associations',
        path: '/assos',
        translate: true,
      },
      {
        icon: Caret,
        name: 'common:navbar.myUEs',
        translate: true,
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
        icon: Caret,
        name: 'common:navbar.myAssociations',
        translate: true,
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
      {
        name: 'common:navbar.myTimetable',
        path: '/user/schedule',
        translate: true,
      },
    ],
    seperator: 4,
    collapsed: isClientSide() && localStorage.getItem('navbarCollapsed') === 'true',
  },
});

const { addItem, replaceItem, removeItem, moveSeparator, setCollapse } = userSlice.actions;

export const addMenuItem = (
  item: MenuItem,
  options?: {
    parents?: string;
    before?: string;
    after?: string;
  },
) =>
  ((dispatch: AppDispatch) => {
    dispatch(
      addItem({
        item,
        parents: options?.parents ?? '',
        before: options?.before || null,
        after: options?.after || null,
      }),
    );
  }) as unknown as Action;

export const replaceMenuItem = (item: MenuItem, replacedItemName: string) =>
  ((dispatch: AppDispatch) => {
    dispatch(replaceItem({ item, search: replacedItemName }));
  }) as unknown as Action;

export const removeMenuItem = (...pathToItem: string[]) =>
  ((dispatch: AppDispatch) => {
    dispatch(removeItem(pathToItem));
  }) as unknown as Action;

export const setAlwaysVisibleCount = (count: number) =>
  ((dispatch: AppDispatch) => {
    dispatch(moveSeparator(count));
  }) as unknown as Action;

export const getMenu = (state: RootState) => state.navbar;

export const setCollapsed = (collapse: boolean) =>
  ((dispatch: AppDispatch) => dispatch(setCollapse(collapse))) as unknown as Action;

export default userSlice.reducer;
