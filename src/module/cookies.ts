import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { AppThunk } from '@/lib/store';
import { isClientSide } from '@/utils/environment';
import { useEffect } from 'react';

export enum CookieNames {
  TOKEN = 'etuutt-token',
}

interface CookiesSlice {
  cookiesAccepted: { [K in CookieNames]: boolean } | null;
  cookies: { [K in CookieNames]: string };
}

export const cookiesSlice = createSlice({
  name: 'session',
  reducers: {
    setCookie: {
      prepare(name: CookieNames, value: string) {
        return { payload: { name, value } };
      },
      reducer(state, action: PayloadAction<{ name: CookieNames; value: string }>) {
        state.cookies[action.payload.name] = action.payload.value;
        if (state.cookiesAccepted?.[action.payload.name]) {
          localStorage.setItem(action.payload.name, action.payload.value);
        }
      },
    },
    setCachedCookies(state, action: PayloadAction<{ [K in CookieNames]: string }>) {
      state.cookies = { ...state.cookies, ...action.payload };
    },
    removeCookie(state, action: PayloadAction<CookieNames>) {
      state.cookies[action.payload] = '';
      if (state.cookiesAccepted?.[action.payload]) {
        localStorage.setItem(action.payload, '');
      }
    },
    setCookiesAcceptance(state, action: PayloadAction<{ [K in CookieNames]: boolean }>) {
      state.cookiesAccepted = { ...state.cookiesAccepted, ...action.payload };
      for (const name of Object.values(CookieNames)) {
        if (state.cookiesAccepted[name]) {
          localStorage.setItem(name, state.cookies[name]);
          console.log(state.cookies[name]);
          console.log(Object.values(state.cookies));
          console.log(name);
        } else {
          localStorage.removeItem(name);
        }
      }
    },
  },
  initialState: {
    cookiesAccepted: null,
    cookies: Object.fromEntries(Object.values(CookieNames).map((name) => [name, ''])),
  } as CookiesSlice,
});

const { setCookie, removeCookie, setCookiesAcceptance, setCachedCookies } = cookiesSlice.actions;
export { setCookie, removeCookie, setCookiesAcceptance };

/**
 * Hook that returns the value of a cookie.
 * @param name the name of the cookie
 * @returns the value of the cookie, or null if the cookie does not exist
 */
export function useCookie(name: CookieNames) {
  return useAppSelector((state) => state.cookies.cookies[name]);
}

/**
 * Action that returns the value of a cookie.
 * @param name the name of the cookie.
 * @return the value of the cookie (string | null).
 */
export function getCookie(name: CookieNames): AppThunk<string | null> {
  return (_, getState) => {
    return getState().cookies.cookies[name];
  };
}

export function initCookies(): AppThunk {
  return (dispatch) => {
    const cookiesAccepted = {} as { [K in CookieNames]: boolean };
    const cookies = {} as { [K in CookieNames]: string };
    if (localStorage.length === 2) return; // User has not accepted nor refused cookies yet.
    for (const name of Object.values(CookieNames)) {
      const value = localStorage.getItem(name);
      if (value !== null) {
        cookiesAccepted[name] = true;
        cookies[name] = value;
      } else {
        cookiesAccepted[name] = false;
      }
    }
    dispatch(setCachedCookies(cookies));
    dispatch(setCookiesAcceptance(cookiesAccepted));
  };
}

export function setAllCookiesAcceptance(accepted: boolean) {
  return setCookiesAcceptance(
    Object.fromEntries(Object.values(CookieNames).map((name) => [name, accepted])) as { [K in CookieNames]: boolean },
  );
}

export default cookiesSlice.reducer;
