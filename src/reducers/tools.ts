import {Action, handleActions} from 'redux-actions';
import * as Actions from '../constants/actions';

const initialState: ToolsStoreState = {
  activeTool: 'move'
}

export default handleActions<ToolsStoreState, any>({
  [Actions.SET_TOOL]: (state: ToolsStoreState, action: Action<string>) => {
    return {
      ...state,
      activeTool: action.payload,
    } as ToolsStoreState
  },
}, initialState);
