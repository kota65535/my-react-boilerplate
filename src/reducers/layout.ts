import {StraightRailItemData} from "components/Rails/StraightRail";
import {CurveRailItemData} from "components/Rails/CurveRail";
import {Action, handleActions} from 'redux-actions';
import {
  LAYOUT_ADD_ITEM, LAYOUT_REMOVE_ITEM, LAYOUT_SET_LAYER_VISIBLE, LAYOUT_SET_LAYERS,
  LAYOUT_UPDATE_ITEM
} from "constants/actions";
import * as update from 'immutability-helper';

export interface LayoutStoreState {
  layers: LayerData[]
}

export interface LayerData {
  id: number
  name: string
  children: ItemData[]
  visible: boolean
}

export interface BaseItemData {
  id: number
  name: string
  type: string    // アイテムの種類、すなわちコンポーネントクラス。この文字列がReactElementのタグ名として用いられる
  layerId: number    // このアイテムが所属するレイヤー
  selected: boolean
}

export type ItemData = BaseItemData | StraightRailItemData | CurveRailItemData


export const LAYOUT_STORE_INITIAL_STATE = {
  layers: [
    {
      id: 1,
      name: 'Layer 1',
      visible: true,
      children: []
    }
  ]
}


export interface AddItemPayload {
  layerId: number
  item: ItemData
}

export interface UpdateItemPayload {
  oldItem: ItemData
  newItem: ItemData
}

export interface RemoveItemPayload {
  item: ItemData
}

export interface SetLayersPayload {
  layers: LayerData[]
}

export interface SetLayerVisiblePayload {
  layerId: number
  visible: boolean
}

export default handleActions<LayoutStoreState, any>({
  [LAYOUT_ADD_ITEM]: (state: LayoutStoreState, action: Action<AddItemPayload>) => {
    // 対象のレイヤー
    const layerIndex = state.layers.findIndex(layer => layer.id === action.payload.layerId)
    return update(state, {
      layers: {
        [layerIndex]: { children: { $push: [action.payload.item] } }
      }
    }) as LayoutStoreState
  },

  [LAYOUT_UPDATE_ITEM]: (state: LayoutStoreState, action: Action<UpdateItemPayload>) => {
    // 対象のレイヤーを探す
    const layerIndex = state.layers.findIndex(layer => layer.id === action.payload.oldItem.layerId)
    // 対象のアイテムを探す
    const itemIndex = state.layers[layerIndex].children.findIndex((item) => item.id === action.payload.oldItem.id)

    return update(state, {
        layers: {
          [layerIndex]: { children: { $splice: [[itemIndex, 1, action.payload.newItem]] } }
        }
      })
  },

  [LAYOUT_REMOVE_ITEM]: (state: LayoutStoreState, action: Action<RemoveItemPayload>) => {
    // 対象のレイヤーを探す
    const layerIndex = state.layers.findIndex(layer => layer.id === action.payload.item.layerId)
    // 対象のアイテムを探す
    const itemIndex = state.layers[layerIndex].children.findIndex((item) => item.id === action.payload.item.id)

    return update(state, {
      layers: {
        [layerIndex]: { children: { $splice: [[itemIndex, 1]] } }
      }
    }) as LayoutStoreState
  },

  [LAYOUT_SET_LAYERS]: (state: LayoutStoreState, action: Action<SetLayersPayload>) => {
    return {
      layers: action.payload.layers
    } as LayoutStoreState
  },

  [LAYOUT_SET_LAYER_VISIBLE]: (state: LayoutStoreState, action: Action<SetLayerVisiblePayload>) => {
    // 対象のレイヤーを探す
    const layerIndex = state.layers.findIndex(layer => layer.id === action.payload.layerId)
    return update(state, {
      layers: {
        [layerIndex]: {visible: {$set: action.payload.visible}}
      }
    }) as LayoutStoreState
  },

}, LAYOUT_STORE_INITIAL_STATE);


