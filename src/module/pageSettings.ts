import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DependencyList, ReactNode, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { usePathname } from 'next/navigation';

interface PageSettingsSlice {
  page: string; // Needed to verify the page has correctly called the hook
  searchParams: Record<string, string>;
  permissions: string;
  hasNavbar: boolean;
  navbarAdditionalComponent: (() => ReactNode) | null;
  loaded: boolean;
  internallyLoaded: boolean;
}

type InternalPageSettingsKeys = 'page' | 'searchParams' | 'loaded' | 'internallyLoaded';

type PageSettings = Omit<PageSettingsSlice, InternalPageSettingsKeys>;

const defaultPageSettings = {
  permissions: 'user',
  hasNavbar: true,
  navbarAdditionalComponent: null,
} as PageSettings;

export const pageSettingsSlice = createSlice({
  name: 'pageSettings',
  reducers: {
    setPageSettings(
      state,
      action: PayloadAction<Pick<PageSettingsSlice, InternalPageSettingsKeys> & Partial<PageSettings>>,
    ) {
      return { ...state, ...defaultPageSettings, ...action.payload };
    },
    setPageParams(state, action: PayloadAction<Record<string, string>>) {
      state.searchParams = action.payload;
      state.internallyLoaded = true;
      return state;
    },
    setLoaded(state, action: PayloadAction<boolean>) {
      state.loaded = action.payload;
      return state;
    },
  },
  initialState: {
    ...defaultPageSettings,
    page: '',
    searchParams: {},
    loaded: false,
    internallyLoaded: false,
  } as PageSettingsSlice,
});

const { setPageSettings, setPageParams, setLoaded } = pageSettingsSlice.actions;
export { setPageParams };

export function usePageSettings(): PageSettingsSlice;
export function usePageSettings(
  settings: Partial<PageSettings & { needsLoading: boolean }>,
  deps?: DependencyList,
): void;
export function usePageSettings(
  settings?: Partial<PageSettings & { needsLoading: boolean }>,
  deps: DependencyList = [],
): PageSettingsSlice | void {
  /* eslint-disable react-hooks/rules-of-hooks */
  const pathname = usePathname();
  if (settings) {
    const dispatch = useAppDispatch();
    useEffect(() => {
      dispatch(
        setPageSettings({
          ...settings,
          page: pathname,
          searchParams: {},
          loaded: !settings.needsLoading,
          internallyLoaded: false,
        }),
      );
    }, deps);
  } else {
    let pageSettings = useAppSelector((state) => state.pageSettings);
    const page = pageSettings.page;
    const [initialized, setInitialized] = useState(page === pathname);
    useEffect(() => {
      if (!initialized) {
        setInitialized(true);
        return;
      }
      if (page !== pathname) {
        console.error(`Page at address ${pathname} did not call hook usePageSettings(...)`);
      }
    }, [initialized]);
    if (pageSettings.page !== pathname) {
      pageSettings = {
        page: pathname,
        searchParams: {},
        loaded: false,
        internallyLoaded: false,
        ...defaultPageSettings,
      };
    }
    return pageSettings;
  }
  /* eslint-enable react-hooks/rules-of-hooks */
}

export function usePageLoaded(instantlyLoaded: boolean = false) {
  const dispatch = useAppDispatch();
  const internallyLoaded = useAppSelector((state) => state.pageSettings.internallyLoaded);
  useEffect(() => {
    if (instantlyLoaded) {
      dispatch(setLoaded(true));
    }
  }, []);
  return { internallyLoaded: internallyLoaded, markPageLoaded: () => dispatch(setLoaded(true)) };
}

export function useSearchParam(param: string): string | undefined {
  return useAppSelector((state) => state.pageSettings.searchParams[param]);
}

export default pageSettingsSlice.reducer;
