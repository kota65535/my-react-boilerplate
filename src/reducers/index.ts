import { combineReducers } from 'redux';
import tools from './tools';
import layers from './layers';

export default combineReducers<RootState>({
  tools,
  layers
});
