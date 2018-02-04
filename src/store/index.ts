import { createStore, applyMiddleware, Store } from 'redux';
import { composeWithDevTools } from "redux-devtools-extension";
import { logger } from '../middleware';
import rootReducer from '../reducers';
import {RootState} from "./type";
import {BUILDER_SET_MARKER_POSITION, BUILDER_SET_MOUSE_POSITION} from "constants/actions";

export function configureStore(initialState?: RootState) {
  let middleware = applyMiddleware(logger);

  if (process.env.NODE_ENV === 'development') {
    const composeEnhancers = composeWithDevTools({
      actionsBlacklist: [BUILDER_SET_MOUSE_POSITION, BUILDER_SET_MARKER_POSITION]
    })
    middleware = composeEnhancers(middleware);
  }

  const store = createStore(rootReducer, initialState, middleware) as Store<RootState>;

  if ((<any>module).hot) {
    (<any>module).hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
