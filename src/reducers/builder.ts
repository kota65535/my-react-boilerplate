import {Action, handleActions} from 'redux-actions';
import * as Actions from 'constants/actions';
import {PaletteItem} from "store/type";
import {Point} from "paper";
import {ItemData} from "reducers/layout";

export enum BuilderPhase {
  CHOOSING_FIRST_RAIL_POSITION,
  CHOOSING_FIRST_RAIL_ANGLE,
  SECOND_RAIL
}


export interface BuilderStoreState {
  selectedItem: PaletteItem
  lastSelectedItems: object
  activeLayerId: number
  mousePosition: Point
  paperViewLoaded: boolean
  temporaryItem: ItemData
  phase: BuilderPhase
  markerPosition: Point
}

const BUILDER_INITIAL_STATE: BuilderStoreState = {
  selectedItem: {type: 'StraightRail', name: 'S280'},
  lastSelectedItems: {
    'Straight Rails': {type: 'StraightRail', name: 'S280'},
    'Curve Rails': {type: 'CurveRail', name: 'C280-45'},
    'Turnouts': {type: 'Turnout', name: 'PR541-15'}
  },
  activeLayerId: 1,
  mousePosition: new Point(0,0),
  paperViewLoaded: false,
  temporaryItem: null,
  phase: BuilderPhase.CHOOSING_FIRST_RAIL_POSITION,
  markerPosition: null
}

export default handleActions<BuilderStoreState, any>({
  [Actions.BUILDER_SET_ACTIVE_LAYER]: (state: BuilderStoreState, action: Action<number>) => {
    return {
      ...state,
      activeLayerid: action.payload
    } as BuilderStoreState
  },

  [Actions.BUILDER_SELECT_PALETTE_ITEM]: (state: BuilderStoreState, action: Action<PaletteItem>) => {
    return {
      ...state,
      selectedItem: action.payload,
      lastSelectedItems: {
        ...state.lastSelectedItems,
        [action.payload!.type]: action.payload
      }
    } as BuilderStoreState
  },

  [Actions.BUILDER_SET_MOUSE_POSITION]: (state: BuilderStoreState, action: Action<Point>) => {
    return {
      ...state,
      mousePosition: action.payload
    } as BuilderStoreState
  },

  [Actions.BUILDER_SET_PAPER_VIEW_LOADED]: (state: BuilderStoreState, action: Action<boolean>) => {
    return {
      ...state,
      paperViewLoaded: action.payload
    } as BuilderStoreState
  },
  [Actions.BUILDER_SET_TEMPORARY_ITEM]: (state: BuilderStoreState, action: Action<ItemData>) => {
    return {
      ...state,
      temporaryItem: action.payload
    } as BuilderStoreState
  },
  [Actions.BUILDER_SET_PHASE]: (state: BuilderStoreState, action: Action<BuilderPhase>) => {
    return {
      ...state,
      phase: action.payload
    } as BuilderStoreState
  },
  [Actions.BUILDER_SET_MARKER_POSITION]: (state: BuilderStoreState, action: Action<Point>) => {
    return {
      ...state,
      markerPosition: action.payload
    } as BuilderStoreState
  },
}, BUILDER_INITIAL_STATE);
