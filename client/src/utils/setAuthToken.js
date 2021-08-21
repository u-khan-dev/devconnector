import api from '../utils/api.js';

const setAuthToken = token => {
  if (token) {
    api.defaults.headers.common['x-auth-token'] = token;
  } else {
    api.defaults.headers.common['x-auth-token'] = null;
  }
};

export default setAuthToken;
