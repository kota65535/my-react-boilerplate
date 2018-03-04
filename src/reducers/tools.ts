import {Action, handleActions} from 'redux-actions';
import * as Actions from '../constants/actions';
import {Tools} from "../constants/tools";
import {ToolsStoreState} from "../store/type";

const initialState: ToolsStoreState = {
  activeTool: Tools.STRAIGHT_RAILS
}

export default handleActions<ToolsStoreState, any>({
  [Actions.SET_TOOL]: (state: ToolsStoreState, action: Action<string>) => {
    // カーソル形状を変更する
    switch (action.payload) {
      case Tools.PAN:
        document.body.style.cursor = 'move'
        break
      default:
        document.body.style.cursor = ''
    }
    return {
      ...state,
      activeTool: action.payload,
    } as ToolsStoreState
  },
}, initialState);
