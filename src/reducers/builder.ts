import {Action, handleActions} from 'redux-actions';
import * as Actions from '../constants/actions';

const initialState: BuilderStoreState = {
  selectedItem: {type: 'Straight Rails', name: 'S280'},
  lastSelectedItems: [
    {type: 'Straight Rails', name: 'S280'},
    {type: 'Curve Rails', name: 'C280-45'},
    {type: 'Turnouts', name: 'PR541-25'}
  ]
}

export default handleActions<BuilderStoreState, any>({
  [Actions.UPDATE_LAST_SELECTED_ITEMS]: (state: BuilderStoreState, action: Action<PaletteItem>) => {
    let newLastSelectedItems = state.lastSelectedItems.map(item =>
      // TODO: remove !
      (item.type === action.payload!.type) ? action.payload : item)
    return {
      ...state,
      lastSelectedItems: newLastSelectedItems
    } as BuilderStoreState
  },
}, initialState);
