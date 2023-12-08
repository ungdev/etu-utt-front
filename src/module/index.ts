import { combineReducers } from '@reduxjs/toolkit';
import user from './user';
import navbar from './navbar';

export default combineReducers({ user, navbar });
