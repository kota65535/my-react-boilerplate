import {Action, handleActions} from 'redux-actions';
import * as Actions from "actions/constants"
import {PaletteItem} from "store/type";
import {Point} from "paper";
import {RailData} from "components/rails";

export enum BuilderPhase {
  NORMAL = 'Normal',
  SET_ANGLE = 'SetAngle',
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
  phase: BuilderPhase.NORMAL,
  markerPosition: null,
}

export default handleActions<BuilderStoreState, any>({
  /**
   * アクティブなレイヤーを変更する。
   * @param {BuilderStoreState} state
   * @param {Action<number>} action
   * @returns {BuilderStoreState}
   */
  [Actions.BUILDER_SET_ACTIVE_LAYER]: (state: BuilderStoreState, action: Action<number>): BuilderStoreState => {
    return {
      ...state,
      activeLayerId: action.payload
    }
  },

  /**
   * パレットで選択中のレールを変更する。
   * @param {BuilderStoreState} state
   * @param {Action<PaletteItem>} action
   * @returns {BuilderStoreState}
   */
  [Actions.BUILDER_SELECT_PALETTE_ITEM]: (state: BuilderStoreState, action: Action<PaletteItem>): BuilderStoreState => {
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

  [Actions.BUILDER_SET_MOUSE_POSITION]: (state: BuilderStoreState, action: Action<Point>): BuilderStoreState => {
    return {
      ...state,
      mousePosition: action.payload
    } as BuilderStoreState
  },

  [Actions.BUILDER_SET_PAPER_VIEW_LOADED]: (state: BuilderStoreState, action: Action<boolean>): BuilderStoreState => {
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
  [Actions.BUILDER_SET_TEMPORARY_ITEM]: (state: BuilderStoreState, action: Action<RailData>): BuilderStoreState => {
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
  [Actions.BUILDER_UPDATE_TEMPORARY_ITEM]: (state: BuilderStoreState, action: Action<Partial<RailData>>): BuilderStoreState => {
    const temporaryItem = {
      ...state.temporaryItem,
      ...action.payload,
      opposingJoints: {
        ...state.temporaryItem.opposingJoints,
        ...action.payload.opposingJoints,
      }
    }
    return {
      ...state,
      temporaryItem: temporaryItem
    } as BuilderStoreState
  },

  [Actions.BUILDER_SET_PHASE]: (state: BuilderStoreState, action: Action<BuilderPhase>): BuilderStoreState => {
    return {
      ...state,
      phase: action.payload
    } as BuilderStoreState
  },
  [Actions.BUILDER_SET_MARKER_POSITION]: (state: BuilderStoreState, action: Action<Point>): BuilderStoreState => {
    return {
      ...state,
      markerPosition: action.payload
    } as BuilderStoreState
  },

}, BUILDER_INITIAL_STATE);
