import { type Action, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '@/lib/store';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useEffect } from 'react';
import apiFetchUERateCriteria from '@/api/ueRate/fetchUERateCriteria';
import { UERateCriterion } from '@/api/ueRate/ueRateCriterion.interface';

interface UERateCriterionSlice {
  items: UERateCriterion[] | null;
}

export const ueRateCriterionSlice = createSlice({
  name: 'session',
  reducers: {
    setCriteria: (state, action: PayloadAction<UERateCriterion[] | null>) => {
      return { ...state, items: action.payload };
    },
  },
  initialState: { items: null } as UERateCriterionSlice,
});

const { setCriteria } = ueRateCriterionSlice.actions;

export const fetchUERateCriteria = () =>
  (async (dispatch: AppDispatch) => {
    dispatch(setCriteria(await apiFetchUERateCriteria()));
  }) as unknown as Action;

export function useUERateCriteria(): UERateCriterion[] | null {
  const ueRateCriteria = useAppSelector((state) => state.ueRateCriterion.items);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (ueRateCriteria === null) {
      dispatch(fetchUERateCriteria());
    }
  }, []);
  return ueRateCriteria;
}

export default ueRateCriterionSlice.reducer;
