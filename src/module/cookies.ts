import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useAppDispatch } from '@/lib/hooks';
import { AppThunk } from '@/lib/store';

export enum CookieNames {
  COOKIES_ACCEPTED = 'etuutt-cookies-accepted',
  TOKEN = 'etuutt-token',
}

interface CookiesSlice {
  cookiesAccepted: boolean | null;
  cookiesWaiting: { [K in string]: string };
}

export const cookiesSlice = createSlice({
  name: 'session',
  reducers: {
    setCookie: {
      prepare(name: string, value: string, addLater: boolean = true) {
        return { payload: { name, value, addLater } };
      },
      reducer(state, action: PayloadAction<{ name: string; value: string; addLater: boolean }>) {
        if (state.cookiesAccepted) {
          localStorage.setItem(action.payload.name, action.payload.value);
        } else if (action.payload.addLater) {
          state.cookiesWaiting[action.payload.name] = action.payload.value;
        }
      },
    },
    removeCookie(state, action: PayloadAction<string>) {
      if (state.cookiesAccepted) {
        localStorage.removeItem(action.payload);
      }
    },
    setCookiesAcceptance(state, action: PayloadAction<boolean>) {
      state.cookiesAccepted = action.payload;
      if (!action.payload) return;
      localStorage.setItem('etuutt-cookies-accepted', 'yes');
      for (const [name, value] of Object.entries(state.cookiesWaiting)) {
        localStorage.setItem(name, value);
      }
    },
  },
  initialState: { cookiesAccepted: null, cookiesWaiting: {} } as CookiesSlice,
});

const { setCookie, removeCookie, setCookiesAcceptance } = cookiesSlice.actions;
export { setCookie, removeCookie, setCookiesAcceptance };

/**
 * Hook that returns the value of a cookie.
 * @param name the name of the cookie
 * @param bypassAcceptance if true, even if user has not given permission to use cookies, we will read the cookie.
 * @returns the value of the cookie, or null if the cookie does not exist
 */
export function useCookie(name: CookieNames, bypassAcceptance: boolean = false) {
  const dispatch = useAppDispatch();
  return dispatch(getCookie(name, bypassAcceptance));
}

/**
 * Action that returns the value of a cookie.
 * @param name the name of the cookie
 * @param bypassAcceptance if true, even if user has not given permission to use cookies, we will read the cookie.
 */
export function getCookie(name: CookieNames, bypassAcceptance: boolean = false): AppThunk<string | null> {
  return (_, getState) => {
    return getState().cookies.cookiesAccepted || bypassAcceptance ? localStorage.getItem(name) : null;
  };
}

export default cookiesSlice.reducer;
