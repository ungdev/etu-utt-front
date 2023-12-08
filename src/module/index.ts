import { combineReducers } from '@reduxjs/toolkit';
import user from './user';
import session from './session';

export default combineReducers({ user, session });
