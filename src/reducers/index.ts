import { combineReducers } from 'redux';
import tools from './tools';
import layers from './layers';
import palette from "./palette";
import builder from "./builder";

export default combineReducers<RootState>({
  tools,
  layers,
  palette,
  builder
});
