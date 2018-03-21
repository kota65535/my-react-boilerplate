import {StraightRailProps} from "components/Rails/StraightRail";
import {Action, handleActions} from 'redux-actions';
import {
  LAYOUT_ADD_LAYER,
  LAYOUT_ADD_RAIL,
  LAYOUT_CLEAR_HISTORY,
  LAYOUT_REDO,
  LAYOUT_REMOVE_LAYER,
  LAYOUT_REMOVE_RAIL,
  LAYOUT_UNDO,
  LAYOUT_UPDATE_LAYER,
  LAYOUT_UPDATE_RAIL
} from "constants/actions";
import update from 'immutability-helper';

export interface LayoutStoreState {
  histories: LayoutData[]
  historyIndex: number
}

export interface LayoutData {
  layers: LayerData[]
  rails: RailData[]
}

export interface LayerData {
  id: number
  name: string
  visible: boolean
}

export interface BaseRailData {
  id: number
  name?: string
  type: string    // アイテムの種類、すなわちコンポーネントクラス。この文字列がReactElementのタグ名として用いられる
  layerId: number    // このアイテムが所属するレイヤー
  selected: boolean
  opposingJoints: JointInfo[]
}

export interface JointInfo {
  railId: number
  jointId: number
}

export type RailData = BaseRailData | BaseRailData & StraightRailProps


export const LAYOUT_STORE_INITIAL_STATE: LayoutStoreState = {
  histories: [
    {
      layers: [
        {
          id: 1,
          name: 'Layer 1',
          visible: true,
        }
      ],
      rails: []
    }
  ],
  historyIndex: 0,
}


export interface RailDataPayload {
  item: RailData
  overwrite?: boolean
}

export interface LayerDataPayload {
  item: LayerData
  overwrite?: boolean
}

// export interface SetLayerVisiblePayload {
//   layerId: number
//   visible: boolean
// }


export default handleActions<LayoutStoreState, any>({
  /**
   * レールをレイアウトに追加する。
   * @param {LayoutStoreState} state
   * @param {Action<RailDataPayload>} action
   * @returns {*}
   */
  [LAYOUT_ADD_RAIL]: (state: LayoutStoreState, action: Action<RailDataPayload>) => {
    const layout = state.histories[state.historyIndex]
    // レイアウトを更新
    const newLayout = update(layout, {
      rails: {$push: [action.payload.item]}
    })
    // ヒストリを更新
    return addHistory(state, newLayout, action.payload.overwrite)
  },

  /**
   * レールを更新する。
   * @param {LayoutStoreState} state
   * @param {Action<RailDataPayload>} action
   * @returns {*}
   */
  [LAYOUT_UPDATE_RAIL]: (state: LayoutStoreState, action: Action<RailDataPayload>) => {
    const layout = state.histories[state.historyIndex]
    // 対象のアイテムを探す
    const itemIndex = layout.rails.findIndex((item) => item.id === action.payload.item.id)
    // レイアウトを更新
    const newLayout = update(layout, {
      rails: {
        [itemIndex]: {$set: action.payload.item}
      }
    })
    // ヒストリを更新
    return addHistory(state, newLayout, action.payload.overwrite)
  },

  /**
   * レールを削除する。
   * @param {LayoutStoreState} state
   * @param {Action<RailDataPayload>} action
   * @returns {*}
   */
  [LAYOUT_REMOVE_RAIL]: (state: LayoutStoreState, action: Action<RailDataPayload>) => {
    const layout = state.histories[state.historyIndex]
    // 対象のアイテムを探す
    const itemIndex = layout.rails.findIndex((item) => item.id === action.payload.item.id)
    // レイアウトを更新
    const newLayout = update(layout, {
      rails: {$splice: [[itemIndex, 1]]}
    })
    // ヒストリを更新
    return addHistory(state, newLayout, action.payload.overwrite)
  },

  /**
   * レイヤーをレイアウトに追加する。
   * @param {LayoutStoreState} state
   * @param {Action<RailDataPayload>} action
   * @returns {*}
   */
  [LAYOUT_ADD_LAYER]: (state: LayoutStoreState, action: Action<LayerDataPayload>) => {
    const layout = state.histories[state.historyIndex]
    // レイアウトを更新
    const newLayout = update(layout, {
      layers: {$push: [action.payload.item]}
    })
    // ヒストリを更新
    return addHistory(state, newLayout, action.payload.overwrite)
  },

  /**
   * レイヤーを更新する。
   * @param {LayoutStoreState} state
   * @param {Action<LayerDataPayload>} action
   * @returns {*}
   */
  [LAYOUT_UPDATE_LAYER]: (state: LayoutStoreState, action: Action<LayerDataPayload>) => {
    const layout = state.histories[state.historyIndex]
    // 対象のアイテムを探す
    const itemIndex = layout.layers.findIndex((item) => item.id === action.payload.item.id)
    // レイアウトを更新
    const newLayout = update(layout, {
      layers: {
        [itemIndex]: {$set: action.payload.item}
      }
    })
    // ヒストリを更新
    return addHistory(state, newLayout, action.payload.overwrite)
  },

  /**
   * レイヤーを削除する。
   * @param {LayoutStoreState} state
   * @param {Action<LayerDataPayload>} action
   * @returns {*}
   */
  [LAYOUT_REMOVE_LAYER]: (state: LayoutStoreState, action: Action<LayerDataPayload>) => {
    const layout = state.histories[state.historyIndex]
    // 対象のアイテムを探す
    const itemIndex = layout.layers.findIndex((item) => item.id === action.payload.item.id)
    // レイアウトを更新
    const newLayout = update(layout, {
      layers: {$splice: [[itemIndex, 1]]}
    })
    // ヒストリを更新
    return addHistory(state, newLayout, action.payload.overwrite)
  },

  /**
   * 一個前のヒストリに戻る。
   * @param {LayoutStoreState} state
   * @param {Action<{}>} action
   * @returns {any}
   */
  [LAYOUT_UNDO]: (state: LayoutStoreState, action: Action<{}>) => {
    if (state.historyIndex > 0) {
      return {
        ...state,
        historyIndex: state.historyIndex - 1
      }
    } else {
      return state
    }
  },

  /**
   * 一個先のヒストリに進む。
   * @param {LayoutStoreState} state
   * @param {Action<{}>} action
   * @returns {any}
   */
  [LAYOUT_REDO]: (state: LayoutStoreState, action: Action<{}>) => {
    if (state.histories.length > 1 && state.historyIndex < state.histories.length - 1) {
      return {
        ...state,
        historyIndex: state.historyIndex + 1
      }
    } else {
      return state
    }
  },

  /**
   * 全てのヒストリを削除する。
   * @param {LayoutStoreState} state
   * @param {Action<{}>} action
   * @returns {{histories: LayoutData[]; historyIndex: number}}
   */
  [LAYOUT_CLEAR_HISTORY]: (state: LayoutStoreState, action: Action<{}>) => {
    return {
      ...state,
      historyIndex: 0
    }
  },

}, LAYOUT_STORE_INITIAL_STATE);


const addHistory = (state: LayoutStoreState, layout: LayoutData, overwrite = false) => {
  if (overwrite) {
    // 最新のヒストリを上書きする
    return update(state, {
      histories: {
        $splice: [[state.historyIndex, 1, layout]],
      },
    })
  } else {
    // ヒストリ配列の末尾に追加する
    return update(state, {
      histories: {
        $splice: [[state.historyIndex + 1, 1, layout]],
      },
      historyIndex: {$set: state.historyIndex + 1},
    })
  }
}

