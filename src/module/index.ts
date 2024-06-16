import { combineReducers } from '@reduxjs/toolkit';
import user from './user';
import navbar from './navbar';
import session from './session';
import pageSettings from './pageSettings';
import homepage from './homepage';
import ueRateCriterion from '@/module/ueRateCriterion';
import cookies from '@/module/cookies';

export default combineReducers({ user, navbar, session, pageSettings, homepage, ueRateCriterion, cookies });
