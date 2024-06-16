import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useEffect } from 'react';
import fetchUERateCriteria from '@/api/ueRate/fetchUERateCriteria';
import { UERateCriterion } from '@/api/ueRate/ueRateCriterion.interface';
import { useAPI } from '@/api/api';
import { Branch } from '@/api/branch/branch.interface';
import { fetchBranches } from '@/api/branch/fetchBranches';

interface ConstantDataSlice {
  ueRateCriteria: UERateCriterion[] | null;
  branches: Branch[] | null;
}

export const constantDataSlice = createSlice({
  name: 'session',
  reducers: {
    setCriteria: (state, action: PayloadAction<UERateCriterion[] | null>) => {
      return { ...state, items: action.payload };
    },
    setBranches: (state, action: PayloadAction<Branch[] | null>) => {
      return { ...state, branches: action.payload };
    }
  },
  initialState: { ueRateCriteria: null, branches: null } as ConstantDataSlice,
});

const { setCriteria, setBranches } = constantDataSlice.actions;

export function useUERateCriteria(): UERateCriterion[] | null {
  const ueRateCriteria = useAppSelector((state) => state.constantData.ueRateCriteria);
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

export function useBranches(): Branch[] | null {
  const branches = useAppSelector((state) => state.constantData.branches);
  const dispatch = useAppDispatch();
  const api = useAPI();
  useEffect(() => {
    if (branches === null) {
      fetchBranches(api)
        .then((branches) => branches && dispatch(setBranches(branches)));
    }
  }, []);
  return branches;
}

export default constantDataSlice.reducer;
