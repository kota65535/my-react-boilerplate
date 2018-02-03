import { combineReducers } from 'redux';
import tools from './tools';
import builder from "./builder";
import layout from "./layout";
import {RootState} from "store/type";

export default combineReducers<RootState>({
  tools,
  layout,
  builder
});

