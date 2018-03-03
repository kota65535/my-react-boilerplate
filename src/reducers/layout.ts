import {StraightRailProps} from "components/Rails/StraightRail";
import {Action, handleActions} from 'redux-actions';
import {
  LAYOUT_ADD_ITEM, LAYOUT_CLEAR_HISTORY, LAYOUT_REMOVE_ITEM, LAYOUT_SET_HISTORY_INDEX, LAYOUT_SET_LAYER_VISIBLE,
  LAYOUT_SET_LAYERS, LAYOUT_SET_LAYERS_NO_HISTORY,
  LAYOUT_UPDATE_ITEM
} from "constants/actions";
import * as update from 'immutability-helper';
import {CurveRailProps} from "components/Rails/CurveRail";

export interface LayoutStoreState {
  histories: LayoutData[]
  historyIndex: number
  nextId: number
}

export interface LayoutData {
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

export type ItemData = BaseItemData | StraightRailProps | CurveRailProps


export const LAYOUT_STORE_INITIAL_STATE: LayoutStoreState = {
  histories: [
    {
      layers: [
        {
          id: 1,
          name: 'Layer 1',
          visible: true,
          children: []
        }
      ]
    }
  ],
  historyIndex: 0,
  nextId: 0
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
  // [LAYOUT_ADD_ITEM]: (state: LayoutStoreState, action: Action<AddItemPayload>) => {
  //   // 対象のレイヤー
  //   const layerIndex = state.layers.findIndex(layer => layer.id === action.payload.layerId)
  //   return update(state, {
  //     layers: {
  //       [layerIndex]: { children: { $push: [action.payload.item] } }
  //     }
  //   }) as LayoutStoreState
  // },
  //
  // [LAYOUT_UPDATE_ITEM]: (state: LayoutStoreState, action: Action<UpdateItemPayload>) => {
  //   // 対象のレイヤーを探す
  //   const layerIndex = state.layers.findIndex(layer => layer.id === action.payload.oldItem.layerId)
  //   // 対象のアイテムを探す
  //   const itemIndex = state.layers[layerIndex].children.findIndex((item) => item.id === action.payload.oldItem.id)
  //
  //   return update(state, {
  //       layers: {
  //         [layerIndex]: { children: { $splice: [[itemIndex, 1, action.payload.newItem]] } }
  //       }
  //     })
  // },
  //
  // [LAYOUT_REMOVE_ITEM]: (state: LayoutStoreState, action: Action<RemoveItemPayload>) => {
  //   // 対象のレイヤーを探す
  //   const layerIndex = state.layers.findIndex(layer => layer.id === action.payload.item.layerId)
  //   // 対象のアイテムを探す
  //   const itemIndex = state.layers[layerIndex].children.findIndex((item) => item.id === action.payload.item.id)
  //
  //   return update(state, {
  //     layers: {
  //       [layerIndex]: { children: { $splice: [[itemIndex, 1]] } }
  //     }
  //   }) as LayoutStoreState
  // },
  [LAYOUT_SET_HISTORY_INDEX]: (state: LayoutStoreState, action: Action<number>) => {
    return {
      ...state,
      historyIndex: action.payload
    }
  },

  [LAYOUT_CLEAR_HISTORY]: (state: LayoutStoreState, action: Action<{}>) => {
    return {
      ...state,
      histories: [],
      historyIndex: 0
    }
  },

  [LAYOUT_SET_LAYERS]: (state: LayoutStoreState, action: Action<SetLayersPayload>) => {
    return update(state, {
      histories: {
        $splice: [[state.historyIndex + 1, 1, {layers: action.payload.layers}]],
      },
      historyIndex: {$set: state.historyIndex + 1}
    })
  },

  [LAYOUT_SET_LAYERS_NO_HISTORY]: (state: LayoutStoreState, action: Action<SetLayersPayload>) => {
    return update(state, {
      histories: {
        $splice: [[state.historyIndex, 1, {layers: action.payload.layers}]],
      }
    })
  },

  // [LAYOUT_SET_LAYER_VISIBLE]: (state: LayoutStoreState, action: Action<SetLayerVisiblePayload>) => {
  //   // 対象のレイヤーを探す
  //   const layerIndex = state.layers.findIndex(layer => layer.id === action.payload.layerId)
  //   return update(state, {
  //     layers: {
  //       [layerIndex]: {visible: {$set: action.payload.visible}}
  //     }
  //   }) as LayoutStoreState
  // },

}, LAYOUT_STORE_INITIAL_STATE);


