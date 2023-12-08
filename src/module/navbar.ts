import { MenuItem } from '@/components/Navbar';
import Home from '@/icons/Home';
import { type Action, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from 'src/lib/store';

export const userSlice = createSlice({
  name: 'navbar',
  reducers: {
    addItem: (state, action: PayloadAction<MenuItem>) => [...state, action.payload],
    addItemBefore: (state, action: PayloadAction<{ item: MenuItem; before: string }>) => {
      let index = state.findIndex(({ name }) => name === action.payload.before);
      if (index < 0) index = state.length;
      state.splice(index, 0, action.payload.item);
    },
    addItemAfter: (state, action: PayloadAction<{ item: MenuItem; after: string }>) => {
      let index = state.findIndex(({ name }) => name === action.payload.after);
      if (index < 0) index = state.length;
      state.splice(index + 1, 0, action.payload.item);
    },
    replaceItem: (state, action: PayloadAction<{ item: MenuItem; search: string }>) => {
      let index = state.findIndex(({ name }) => name === action.payload.search);
      if (index < 0) index = state.length;
      state.splice(index, 1, action.payload.item);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      let index = state.findIndex(({ name }) => name === action.payload);
      state.splice(index, 1);
    },
  },
  initialState: <MenuItem<boolean>[]>[
    {
      icon: Home,
      name: 'Accueil',
      path: '/',
    },
    {
      name: 'Trombinoscope',
      path: '/users',
    },
    {
      icon: Home,
      name: 'Guide des ues',
      path: '/ues',
    },
    {
      name: 'Associations',
      path: '/assos',
    },
    {
      name: 'Mes Matières',
      submenus: [],
    },
    {
      name: 'Mes Assos',
      submenus: [],
    },
    {
      name: 'Mon EDT',
      path: '/user/schedule',
    },
  ],
});

const { addItem, addItemAfter, addItemBefore, replaceItem, removeItem } = userSlice.actions;

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

export const getMenu = (state: RootState) => state.navbar;

export default userSlice.reducer;
