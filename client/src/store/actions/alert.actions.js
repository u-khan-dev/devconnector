import { SET_ALERT, REMOVE_ALERT } from './types.js';
import { v4 as uuidv4 } from 'uuid';

// dispatch comes from redux-thunk

export const setAlert =
  (message, alertType, timeout = 5000) =>
  dispatch => {
    const id = uuidv4();

    dispatch({
      type: SET_ALERT,
      payload: { message, alertType, id }
    });

    setTimeout(() => {
      dispatch({
        type: REMOVE_ALERT,
        payload: id
      });
    }, timeout);
  };
