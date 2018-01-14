import { createAction } from 'redux-actions';
import * as Actions from '../constants/actions';

export const setTool = createAction<string>(Actions.SET_TOOL);
export const setActiveLayer = createAction<string>(Actions.SET_ACTIVE_LAYER);
export const setLayerVisible = createAction<boolean[]>(Actions.SET_LAYER_VISIBLE);
export const selectItem = createAction<PaletteItem>(Actions.SELECT_ITEM);
export const setPaletteMode = createAction<string>(Actions.SET_PALETTE_MODE);
export const updateLastSelectedItems = createAction<PaletteItem>(Actions.UPDATE_LAST_SELECTED_ITEMS);
