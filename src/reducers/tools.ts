import {Action, handleActions} from 'redux-actions';
import * as Actions from '../constants/actions';
import {Tools} from "../constants/tools";
import {ToolsStoreState} from "../store/type";

const initialState: ToolsStoreState = {
  activeTool: Tools.STRAIGHT_RAILS
}

export default handleActions<ToolsStoreState, any>({
  [Actions.SET_TOOL]: (state: ToolsStoreState, action: Action<string>) => {
    return {
      ...state,
      activeTool: action.payload,
    } as ToolsStoreState
  },
}, initialState);
