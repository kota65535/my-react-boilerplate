import {createAction} from 'redux-actions';
import {RailDataPayload, SetLayerVisiblePayload,} from "reducers/layout";
import {
  LAYOUT_ADD_RAIL,
  LAYOUT_CLEAR_HISTORY,
  LAYOUT_REDO,
  LAYOUT_REMOVE_RAIL,
  LAYOUT_SET_LAYER_VISIBLE,
  LAYOUT_UNDO,
  LAYOUT_UPDATE_RAIL
} from "constants/actions";

export const addRail = createAction<RailDataPayload>(LAYOUT_ADD_RAIL)
export const updateRail = createAction<RailDataPayload>(LAYOUT_UPDATE_RAIL)
export const removeRail = createAction<RailDataPayload>(LAYOUT_REMOVE_RAIL)
export const undo = createAction<{}>(LAYOUT_UNDO)
export const redo = createAction<{}>(LAYOUT_REDO)
export const clearHistory = createAction<{}>(LAYOUT_CLEAR_HISTORY)
export const setLayerVisible = createAction<SetLayerVisiblePayload>(LAYOUT_SET_LAYER_VISIBLE)
