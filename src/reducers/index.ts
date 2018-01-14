import { combineReducers } from 'redux';
import tools from './tools';
import layers from './layers';
import builder from "./builder";

export default combineReducers<RootState>({
  tools,
  layers,
  builder
});
