import {Action, handleActions} from 'redux-actions';
import * as Actions from '../constants/actions';

const initialState: LayersStoreState = {
  activeLayer: 'L1',
  visible: [true, true]
}

export default handleActions<LayersStoreState, any>({
  [Actions.SET_ACTIVE_LAYER]: (state: LayersStoreState, action: Action<string>) => {
    return {
      ...state,
      activeLayer: action.payload,
    } as LayersStoreState
  },
  [Actions.SET_LAYER_VISIBLE]: (state: LayersStoreState, action: Action<boolean[]>) => {
    return {
      ...state,
      visible: action.payload,
    } as LayersStoreState
  },
}, initialState);
