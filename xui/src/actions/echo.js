import { API_ROOT } from '../index';
import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
export const ECHO_REQUEST = '@@echo/ECHO_REQUEST';
export const ECHO_SUCCESS = '@@echo/ECHO_SUCCESS';
export const ECHO_FAILURE = '@@echo/ECHO_FAILURE';
export const echo = () => ({
  [RSAA]: {
      endpoint: API_ROOT + '/api/echo/',
      method: 'POST',
      body: JSON.stringify({message: "OK"}),
      headers: { 'Content-Type': 'application/json' },
      types: [
        ECHO_REQUEST, ECHO_SUCCESS, ECHO_FAILURE
      ]
  }
})
