import {Action, handleActions} from 'redux-actions';
import {
  BUILDER_SELECT_PALETTE_ITEM,
  BUILDER_SET_ACTIVE_LAYER,
  BUILDER_SET_MARKER_POSITION,
  BUILDER_SET_MOUSE_POSITION,
  BUILDER_SET_PAPER_VIEW_LOADED,
  BUILDER_SET_PHASE,
  BUILDER_SET_TEMPORARY_ITEM,
  BUILDER_UPDATE_TEMPORARY_ITEM
} from 'constants/actions';
import {PaletteItem} from "store/type";
import {Point} from "paper";
import {RailData} from "components/Rails";

export enum BuilderPhase {
  FIRST_POSITION = 'FirstPosition',
  FIRST_ANGLE = 'FirstAngle',
  SUBSEQUENT = 'Subsequent'
}

export interface LastPaletteItems {
  [key: string]: PaletteItem
}


export interface BuilderStoreState {
  // パレットで選択中のレール
  paletteItem: PaletteItem
  // 直前に選択していたレール
  lastPaletteItems: LastPaletteItems
  activeLayerId: number
  mousePosition: Point
  paperViewLoaded: boolean
  temporaryItem: RailData
  phase: BuilderPhase
  markerPosition: Point
}

const BUILDER_INITIAL_STATE: BuilderStoreState = {
  paletteItem: {type: 'StraightRail', name: 'S280'},
  lastPaletteItems: {
    'Straight Rails': {type: 'StraightRail', name: 'S280'},
    'Curve Rails': {type: 'CurveRail', name: 'C280-45'},
    'Turnouts': {type: 'Turnout', name: 'PR541-15'}
  },
  activeLayerId: 1,
  mousePosition: new Point(0,0),
  paperViewLoaded: false,
  temporaryItem: null,
  phase: BuilderPhase.FIRST_POSITION,
  markerPosition: null,
}

export default handleActions<BuilderStoreState, any>({
  /**
   * アクティブなレイヤーを変更する。
   * @param {BuilderStoreState} state
   * @param {Action<number>} action
   * @returns {BuilderStoreState}
   */
  [BUILDER_SET_ACTIVE_LAYER]: (state: BuilderStoreState, action: Action<number>) => {
    return {
      ...state,
      activeLayerid: action.payload
    } as BuilderStoreState
  },

  /**
   * パレットで選択中のレールを変更する。
   * @param {BuilderStoreState} state
   * @param {Action<PaletteItem>} action
   * @returns {BuilderStoreState}
   */
  [BUILDER_SELECT_PALETTE_ITEM]: (state: BuilderStoreState, action: Action<PaletteItem>) => {
    return {
      ...state,
      paletteItem: action.payload,
      lastPaletteItems: {
        ...state.lastPaletteItems,
        [action.payload.type]: action.payload
      },
      temporaryPivotJointIndex: 0   // PivotJointをリセットする
    } as BuilderStoreState
  },

  [BUILDER_SET_MOUSE_POSITION]: (state: BuilderStoreState, action: Action<Point>) => {
    return {
      ...state,
      mousePosition: action.payload
    } as BuilderStoreState
  },

  [BUILDER_SET_PAPER_VIEW_LOADED]: (state: BuilderStoreState, action: Action<boolean>) => {
    return {
      ...state,
      paperViewLoaded: action.payload
    } as BuilderStoreState
  },

  /**
   * 仮レールを設定する。
   * @param {BuilderStoreState} state
   * @param {Action<RailData>} action
   * @returns {BuilderStoreState}
   */
  [BUILDER_SET_TEMPORARY_ITEM]: (state: BuilderStoreState, action: Action<RailData>) => {
    return {
      ...state,
      temporaryItem: action.payload
    } as BuilderStoreState
  },

  /**
   * 仮レールを更新する。
   * @param {BuilderStoreState} state
   * @param {Action<number>} action
   * @returns {BuilderStoreState}
   */
  [BUILDER_UPDATE_TEMPORARY_ITEM]: (state: BuilderStoreState, action: Action<Partial<RailData>>) => {
    return {
      ...state,
      temporaryItem: {
        ...state.temporaryItem,
        ...action.payload
      },
    } as BuilderStoreState
  },

  [BUILDER_SET_PHASE]: (state: BuilderStoreState, action: Action<BuilderPhase>) => {
    return {
      ...state,
      phase: action.payload
    } as BuilderStoreState
  },
  [BUILDER_SET_MARKER_POSITION]: (state: BuilderStoreState, action: Action<Point>) => {
    return {
      ...state,
      markerPosition: action.payload
    } as BuilderStoreState
  },

}, BUILDER_INITIAL_STATE);
