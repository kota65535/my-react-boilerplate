import {createAction} from 'redux-actions';
import * as Actions from '../constants/actions';

export const setTool = createAction<string>(Actions.SET_TOOL);
export const setAuthData = createAction<any>(Actions.SET_AUTH_DATA)
