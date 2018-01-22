import { createAction } from 'redux-actions';
import * as Actions from '../constants/actions';

export const selectPaletteItem = createAction<PaletteItem>(Actions.SELECT_PALETTE_ITEM);
export const setPaletteMode = createAction<string>(Actions.SET_PALETTE_MODE);
export const updateLastSelectedItems = createAction<PaletteItem>(Actions.UPDATE_LAST_SELECTED_ITEMS);
