import {createAction} from 'redux-actions';
import {
  DeleteItemDataPayload,
  LayerDataPayload,
  LayoutData,
  PartialLayerDataPayload,
  PartialRailDataPayload,
  RailDataPayload
} from "reducers/layout";
import * as Actions from "actions/constants";

export const addRail = createAction<RailDataPayload>(Actions.LAYOUT_ADD_RAIL)
export const updateRail = createAction<PartialRailDataPayload>(Actions.LAYOUT_UPDATE_RAIL)
export const removeRail = createAction<RailDataPayload>(Actions.LAYOUT_REMOVE_RAIL)

export const addLayer = createAction<LayerDataPayload>(Actions.LAYOUT_ADD_LAYER)
export const updateLayer = createAction<PartialLayerDataPayload>(Actions.LAYOUT_UPDATE_LAYER)
export const deleteLayer = createAction<DeleteItemDataPayload>(Actions.LAYOUT_DELETE_LAYER)

export const undo = createAction<{}>(Actions.LAYOUT_UNDO)
export const redo = createAction<{}>(Actions.LAYOUT_REDO)
export const addHistory = createAction<{}>(Actions.LAYOUT_ADD_HISTORY)
export const clearHistory = createAction<{}>(Actions.LAYOUT_CLEAR_HISTORY)

export const setLayoutName = createAction<string>(Actions.LAYOUT_SET_NAME)
export const loadLayout = createAction<LayoutData>(Actions.LAYOUT_LOAD_LAYOUT)