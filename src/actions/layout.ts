import {createAction} from 'redux-actions';
import {LayerDataPayload, PartialRailDataPayload, RailDataPayload} from "reducers/layout";
import {
  LAYOUT_ADD_HISTORY,
  LAYOUT_ADD_LAYER,
  LAYOUT_ADD_RAIL,
  LAYOUT_CLEAR_HISTORY,
  LAYOUT_REDO,
  LAYOUT_REMOVE_LAYER,
  LAYOUT_REMOVE_RAIL,
  LAYOUT_SET_NAME,
  LAYOUT_UNDO,
  LAYOUT_UPDATE_LAYER,
  LAYOUT_UPDATE_RAIL
} from "constants/actions";

export const addRail = createAction<RailDataPayload>(LAYOUT_ADD_RAIL)
export const updateRail = createAction<PartialRailDataPayload>(LAYOUT_UPDATE_RAIL)
export const removeRail = createAction<RailDataPayload>(LAYOUT_REMOVE_RAIL)

export const addLayer = createAction<LayerDataPayload>(LAYOUT_ADD_LAYER)
export const updateLayer = createAction<LayerDataPayload>(LAYOUT_UPDATE_LAYER)
export const removeLayer = createAction<LayerDataPayload>(LAYOUT_REMOVE_LAYER)

export const undo = createAction<{}>(LAYOUT_UNDO)
export const redo = createAction<{}>(LAYOUT_REDO)
export const addHistory = createAction<{}>(LAYOUT_ADD_HISTORY)
export const clearHistory = createAction<{}>(LAYOUT_CLEAR_HISTORY)

export const setLayoutName = createAction<string>(LAYOUT_SET_NAME)