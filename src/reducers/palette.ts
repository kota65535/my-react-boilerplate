import {Action, handleActions} from 'redux-actions';
import * as Actions from '../constants/actions';

const initialState: PaletteStoreState = {
  // selectedItem: {
  //   name: "S280",
  //   type: "Straight Rails"
  // },
  mode: "Builder"
}

export default handleActions<PaletteStoreState, any>({
  [Actions.SELECT_ITEM]: (state: PaletteStoreState, action: Action<PaletteItem>) => {
    return {
      ...state,
      selectedItem: action.payload,
    } as PaletteStoreState
  },
  [Actions.SET_PALETTE_MODE]: (state: PaletteStoreState, action: Action<string>) => {
    return {
      ...state,
      mode: action.payload,
    } as PaletteStoreState
  },
}, initialState);
