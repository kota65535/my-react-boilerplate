import { createAction } from 'redux-actions';
import {
  AddItemPayload, RemoveItemPayload, SetLayersPayload, SetLayerVisiblePayload,
  UpdateItemPayload
} from "reducers/layout";
import {
  LAYOUT_ADD_ITEM, LAYOUT_REMOVE_ITEM, LAYOUT_SET_HISTORY_INDEX, LAYOUT_SET_LAYER_VISIBLE, LAYOUT_SET_LAYERS,
  LAYOUT_SET_LAYERS_NO_HISTORY,
  LAYOUT_UPDATE_ITEM
} from "constants/actions";

// export const addItem = createAction<AddItemPayload>(LAYOUT_ADD_ITEM)
// export const updateItem = createAction<UpdateItemPayload>(LAYOUT_UPDATE_ITEM)
// export const removeItem = createAction<RemoveItemPayload>(LAYOUT_REMOVE_ITEM)
export const setLayers = createAction<SetLayersPayload>(LAYOUT_SET_LAYERS)
export const setLayersNoHistory = createAction<SetLayersPayload>(LAYOUT_SET_LAYERS_NO_HISTORY)
export const setHistoryIndex = createAction<number>(LAYOUT_SET_HISTORY_INDEX)
export const setLayerVisible = createAction<SetLayerVisiblePayload>(LAYOUT_SET_LAYER_VISIBLE)
export const clearHistory = createAction<{}>(LAYOUT_SET_HISTORY_INDEX)
