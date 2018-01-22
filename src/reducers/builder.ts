import {Action, handleActions} from 'redux-actions';
import * as Actions from '../constants/actions';

const initialState: BuilderStoreState = {
  selectedItem: {type: 'StraightRail', name: 'S280'},
  lastSelectedItems: {
    'Straight Rails': {type: 'StraightRail', name: 'S280'},
    'Curve Rails': {type: 'CurveRail', name: 'C280-45'},
    'Turnouts': {type: 'Turnout', name: 'PR541-15'}
  }
}

export default handleActions<BuilderStoreState, any>({
  [Actions.SELECT_PALETTE_ITEM]: (state: BuilderStoreState, action: Action<PaletteItem>) => {
    // let lastSelectedItems = {
    //   ...state.lastSelectedItems,
    //   [action.payload!.type]: action.payload
    // }

    return {
      ...state,
      selectedItem: action.payload,
      lastSelectedItems: {
        ...state.lastSelectedItems,
        [action.payload!.type]: action.payload
      }
    } as BuilderStoreState
  },
}, initialState);
