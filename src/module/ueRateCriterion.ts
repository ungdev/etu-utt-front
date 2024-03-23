import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useEffect } from 'react';
import fetchUERateCriteria from '@/api/ueRate/fetchUERateCriteria';
import { UERateCriterion } from '@/api/ueRate/ueRateCriterion.interface';
import { useAPI } from '@/api/api';

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

export function useUERateCriteria(): UERateCriterion[] | null {
  const ueRateCriteria = useAppSelector((state) => state.ueRateCriterion.items);
  const dispatch = useAppDispatch();
  const api = useAPI();
  useEffect(() => {
    if (ueRateCriteria === null) {
      fetchUERateCriteria(api)
        .toPromise()
        .then((criteria) => criteria && dispatch(setCriteria(criteria)));
    }
  }, []);
  return ueRateCriteria;
}

export default ueRateCriterionSlice.reducer;
