import { combineReducers } from 'redux';
import alert from './alert.reducer.js';
import auth from './auth.reducer.js';
import post from './post.reducer.js';
import profile from './profile.reducer.js';

export default combineReducers({ alert, auth, profile, post });
