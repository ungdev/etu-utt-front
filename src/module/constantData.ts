import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useEffect } from 'react';
import fetchUERateCriteria from '@/api/ueRate/fetchUERateCriteria';
import { UERateCriterion } from '@/api/ueRate/ueRateCriterion.interface';
import { useAPI } from '@/api/api';
import { Branch } from '@/api/branch/branch.interface';
import { fetchBranches } from '@/api/branch/fetchBranches';
import { CreditCategory } from '@/api/credit/credit.interface';
import { fetchCreditCategories } from '@/api/credit/fetchCreditCategories';
import { useLoggedIn } from "@/module/session";

interface ConstantDataSlice {
  ueRateCriteria: UERateCriterion[] | null;
  branches: Branch[] | null;
  creditCategories: CreditCategory[] | null;
}

export const constantDataSlice = createSlice({
  name: 'session',
  reducers: {
    setCriteria: (state, action: PayloadAction<UERateCriterion[] | null>) => {
      return { ...state, ueRateCriteria: action.payload };
    },
    setBranches: (state, action: PayloadAction<Branch[] | null>) => {
      return { ...state, branches: action.payload };
    },
    setCreditCategories: (state, action: PayloadAction<CreditCategory[] | null>) => {
      return { ...state, creditCategories: action.payload };
    },
  },
  initialState: { ueRateCriteria: null, branches: null, creditCategories: null } as ConstantDataSlice,
});

const { setCriteria, setBranches, setCreditCategories } = constantDataSlice.actions;

export function useUERateCriteria(): UERateCriterion[] | null {
  const loggedIn = useLoggedIn();
  const ueRateCriteria = useAppSelector((state) => state.constantData.ueRateCriteria);
  const dispatch = useAppDispatch();
  const api = useAPI();
  useEffect(() => {
    if (ueRateCriteria !== null || !loggedIn) return;
    fetchUERateCriteria(api).then((criteria) => {
      if (criteria) {
        dispatch(setCriteria(criteria));
      }
    });
  }, [loggedIn]);
  return ueRateCriteria;
}

export function useBranches(): Branch[] | null {
  const branches = useAppSelector((state) => state.constantData.branches);
  const dispatch = useAppDispatch();
  const api = useAPI();
  useEffect(() => {
    if (branches === null) {
      fetchBranches(api).then((branches) => branches && dispatch(setBranches(branches)));
    }
  }, []);
  return branches;
}

export function useCreditCategories(): CreditCategory[] | null {
  const creditCategories = useAppSelector((state) => state.constantData.creditCategories);
  const dispatch = useAppDispatch();
  const api = useAPI();
  useEffect(() => {
    if (creditCategories === null) {
      fetchCreditCategories(api).then((creditCategories) => dispatch(setCreditCategories(creditCategories)));
    }
  }, []);
  return creditCategories;
}

export default constantDataSlice.reducer;
