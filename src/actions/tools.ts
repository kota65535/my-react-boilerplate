import { createAction } from 'redux-actions';
import * as Actions from '../constants/actions';

export const setTool = createAction<string>(Actions.SET_TOOL);
export const setActiveLayer = createAction<string>(Actions.SET_ACTIVE_LAYER);
export const setLayerVisible = createAction<boolean[]>(Actions.SET_LAYER_VISIBLE);
