import { MenuItem } from '@/components/Navbar';
import Book from '@/icons/Book';
import Caret from '@/icons/Caret';
import Home from '@/icons/Home';
import User from '@/icons/User';
import Users from '@/icons/Users';
import { type Action, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from 'src/lib/store';

export const userSlice = createSlice({
  name: 'navbar',
  reducers: {
    addItem: (state, action: PayloadAction<MenuItem>) => {
      state.items = [...state.items, action.payload];
    },
    addItemBefore: (state, action: PayloadAction<{ item: MenuItem; before: string }>) => {
      let index = state.items.findIndex(({ name }) => name === action.payload.before);
      if (index < 0) index = state.items.length;
      state.items.splice(index, 0, action.payload.item);
    },
    addItemAfter: (state, action: PayloadAction<{ item: MenuItem; after: string }>) => {
      let index = state.items.findIndex(({ name }) => name === action.payload.after);
      if (index < 0) index = state.items.length;
      state.items.splice(index + 1, 0, action.payload.item);
    },
    replaceItem: (state, action: PayloadAction<{ item: MenuItem; search: string }>) => {
      let index = state.items.findIndex(({ name }) => name === action.payload.search);
      if (index < 0) index = state.items.length;
      state.items.splice(index, 1, action.payload.item);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      let index = state.items.findIndex(({ name }) => name === action.payload);
      state.items.splice(index, 1);
    },
    moveSeparator: (state, action: PayloadAction<number>) => {
      state.seperator = action.payload;
    },
  },
  initialState: <{ items: MenuItem<boolean>[]; seperator: number }>{
    items: [
      {
        icon: Home,
        name: 'Accueil',
        path: '/',
      },
      {
        icon: User,
        name: 'Trombinoscope',
        path: '/users',
      },
      {
        icon: Book,
        name: 'Guide des ues',
        path: '/ues',
      },
      {
        icon: Users,
        name: 'Associations',
        path: '/assos',
      },
      {
        icon: Caret,
        name: 'Mes Matières',
        submenus: [
          {
            name: 'IF01',
            path: '/ue/if01',
          },
          {
            name: 'SY04',
            path: '/ue/sy04',
          },
        ],
      },
      {
        icon: Caret,
        name: 'Mes Assos',
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
        name: 'Mon EDT',
        path: '/user/schedule',
      },
    ],
    seperator: 4,
  },
});

const { addItem, addItemAfter, addItemBefore, replaceItem, removeItem, moveSeparator } = userSlice.actions;

export const addMenuItem = (item: MenuItem) =>
  ((dispatch: AppDispatch) => {
    dispatch(addItem(item));
  }) as unknown as Action;

export const addMenuItemBefore = (item: MenuItem, itemBeforeName: string) =>
  ((dispatch: AppDispatch) => {
    dispatch(addItemBefore({ item, before: itemBeforeName }));
  }) as unknown as Action;

export const addMenuItemAfter = (item: MenuItem, itemAfterName: string) =>
  ((dispatch: AppDispatch) => {
    dispatch(addItemAfter({ item, after: itemAfterName }));
  }) as unknown as Action;

export const replaceMenuItem = (item: MenuItem, replacedItemName: string) =>
  ((dispatch: AppDispatch) => {
    dispatch(replaceItem({ item, search: replacedItemName }));
  }) as unknown as Action;

export const removeMenuItem = (itemName: string) =>
  ((dispatch: AppDispatch) => {
    dispatch(removeItem(itemName));
  }) as unknown as Action;

export const setAlwaysVisibleCount = (count: number) =>
  ((dispatch: AppDispatch) => {
    dispatch(moveSeparator(count));
  }) as unknown as Action;

export const getMenu = (state: RootState) => state.navbar;

export default userSlice.reducer;
