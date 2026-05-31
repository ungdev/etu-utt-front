import { combineReducers } from '@reduxjs/toolkit';
import navbar from './navbar';
import session from './session';
import pageSettings from './pageSettings';
import homepage from './homepage';
import constantData from '@/module/constantData';

export default combineReducers({ navbar, session, pageSettings, homepage, constantData });
