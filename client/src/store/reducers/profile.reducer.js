import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  GET_REPOS,
  NO_REPOS
} from '../actions/types.js';

const initialState = {
  profile: null, // will hold your profile or that of a user you visit
  profiles: [], // list of developers
  repos: [],
  loading: true,
  error: {}
};

const profile = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return { ...state, profile: payload, loading: false };
    case GET_PROFILES:
      return { ...state, profiles: payload, loading: false };
    case GET_REPOS:
      return { ...state, repos: payload, loading: false };
    case NO_REPOS:
      return {
        ...state,
        repos: []
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false
      };
    default:
      return state;
  }
};

export default profile;
