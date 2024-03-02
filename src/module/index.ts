import { combineReducers } from '@reduxjs/toolkit';
import user from './user';
import navbar from './navbar';
import session from './session';
import pageSettings from './pageSettings';
import parking from './parking';

export default combineReducers({ user, navbar, session, pageSettings, parking });
