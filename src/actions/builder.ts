import { createAction } from 'redux-actions';
import * as Actions from "constants/actions";
import {PaletteItem} from "store/type";
import Point = paper.Point;

export const selectPaletteItem = createAction<PaletteItem>(Actions.BUILDER_SELECT_PALETTE_ITEM);
export const setPaletteMode = createAction<string>(Actions.SET_PALETTE_MODE);
export const setActiveLayer = createAction<number>(Actions.BUILDER_SET_ACTIVE_LAYER);
export const setMousePosition = createAction<Point>(Actions.BUILDER_SET_MOUSE_POSITION);
