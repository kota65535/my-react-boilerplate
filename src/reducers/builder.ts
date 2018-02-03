import {Action, handleActions} from 'redux-actions';
import * as Actions from '../constants/actions';
import {PaletteItem} from "../store/type";


export interface BuilderStoreState {
  selectedItem: PaletteItem
  lastSelectedItems: object
  activeLayerId: number
}

const BUILDER_INITIAL_STATE: BuilderStoreState = {
  selectedItem: {type: 'StraightRail', name: 'S280'},
  lastSelectedItems: {
    'Straight Rails': {type: 'StraightRail', name: 'S280'},
    'Curve Rails': {type: 'CurveRail', name: 'C280-45'},
    'Turnouts': {type: 'Turnout', name: 'PR541-15'}
  },
  activeLayerId: 1
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
}, BUILDER_INITIAL_STATE);
