import { combineReducers } from 'redux';
import tools from './tools';
import layers from './layers';
import palette from "./palette";

export default combineReducers<RootState>({
  tools,
  layers,
  palette
});
