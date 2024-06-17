import { combineReducers } from '@reduxjs/toolkit';
import user from './user';
import navbar from './navbar';
import session from './session';
import pageSettings from './pageSettings';
import homepage from './homepage';
import constantData from '@/module/constantData';
import cookies from '@/module/cookies';

export default combineReducers({ user, navbar, session, pageSettings, homepage, constantData, cookies });
