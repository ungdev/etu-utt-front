import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

interface PageSettingsSlice {
  permissions: string;
  hasNavbar: boolean;
  navbarAdditionalComponent: FC<Record<string, never>> | null;
  searchParams: Record<string, string>;
  pageComponentReady: boolean;
  internalLoading: {
    pageParamsLoaded: boolean;
    permissionsVerified: boolean;
    settingsLoaded: boolean;
  };
}

type InternalPageSettingsKeys = 'searchParams' | 'loaded' | 'internalLoading';

type PageSettings = Omit<PageSettingsSlice, InternalPageSettingsKeys>;

export const defaultPageSettings = {
  permissions: 'user',
  hasNavbar: true,
  navbarAdditionalComponent: null,
} as PageSettings;

export const getInitialState = () =>
  ({
    ...defaultPageSettings,
    pageComponentReady: false,
    searchParams: {},
    internalLoading: {
      pageParamsLoaded: false,
      permissionsVerified: false,
      settingsLoaded: false,
    },
  }) as PageSettingsSlice;

export const pageSettingsSlice = createSlice({
  name: 'pageSettings',
  reducers: {
    initPageSettings() {
      return getInitialState();
    },
    updatePageSettings(state, action: PayloadAction<Partial<PageSettings & { needsLoading: boolean }>>) {
      return {
        ...state,
        ...action.payload,
        pageComponentReady: state.pageComponentReady || !action.payload.needsLoading,
        internalLoading: {
          ...state.internalLoading,
          settingsLoaded: true,
          permissionsVerified: true, // TODO: verify them properly :eyes:
        },
      };
    },
    setPageParams(state, action: PayloadAction<Record<string, string>>) {
      state.searchParams = action.payload;
      state.internalLoading.pageParamsLoaded = true;
      return state;
    },
    setLoaded(state, action: PayloadAction<boolean>) {
      state.pageComponentReady = action.payload;
      return state;
    },
  },
  initialState: getInitialState(),
});

const { initPageSettings, updatePageSettings, setPageParams, setLoaded } = pageSettingsSlice.actions;
export { setPageParams, initPageSettings, updatePageSettings };

export function usePageSettings(): PageSettingsSlice {
  return useAppSelector((state) => state.pageSettings);
}

/**
 * Hook that can be used to manage the loading of the page.
 * @returns {internallyLoaded} True when the page finished loading internally (search parameters, permission checks, ..., in general all the loading not managed by the main page component)
 * @returns {pageComponentReady} Whether the page was marked as loaded by the main page component. This does not mean that the page is fully loaded, only that the component is ready to be displayed.
 * @returns {loaded} Whether the page is currently displayed or not. It's true only when main component is ready and internal loading is done.
 * @returns {markPageLoaded} A function you can call at any point to mark the main page component as loaded.
 */
export function usePageLoaded() {
  const dispatch = useAppDispatch();
  const pageSettings = useAppSelector((state) => state.pageSettings);
  const internallyLoaded = Object.values(pageSettings.internalLoading).every((value) => value);
  return {
    ...pageSettings.internalLoading,
    internallyLoaded,
    pageComponentReady: pageSettings.pageComponentReady,
    loaded: internallyLoaded && pageSettings.pageComponentReady,
    markPageLoaded: () => dispatch(setLoaded(true)),
  };
}

export function useSearchParam(param: string): string | undefined {
  return useAppSelector((state) => state.pageSettings.searchParams[param]);
}

export default pageSettingsSlice.reducer;
