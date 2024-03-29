import { combineReducers } from '@reduxjs/toolkit';
import user from './user';
import navbar from './navbar';
import session from './session';
import ueRateCriterion from '@/module/ueRateCriterion';

export default combineReducers({ user, navbar, session, ueRateCriterion });
