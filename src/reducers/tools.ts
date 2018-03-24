import {Action, handleActions} from 'redux-actions';
import * as Actions from '../constants/actions';
import {Tools} from "../constants/tools";
import {ToolsStoreState} from "../store/type";

const initialState: ToolsStoreState = {
  activeTool: Tools.STRAIGHT_RAILS,
  authData: null
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

  /**
   * 認証結果をセットする。
   * @param {ToolsStoreState} state
   * @param {Action<string>} action
   * @returns {{activeTool: string; authData: any}}
   */
  [Actions.SET_AUTH_DATA]: (state: ToolsStoreState, action: Action<string>) => {
    return {
      ...state,
      authData: action.payload
    }
  }
}, initialState);
