import {RootState} from "store/type";
import * as _ from "lodash";

export const currentLayoutData = (state: RootState) => {
  return state.layout.histories[state.layout.historyIndex]
}

export const isLayoutEmpty = (state: RootState) => {
  return _.flatMap(currentLayoutData(state).layers, (layer) => layer.children).length === 0
}

export const nextRailId = (state: RootState) => {
  let ids = _.flatMap(currentLayoutData(state).layers, layer => layer.children.map(itemData => itemData.id))
  return ids.length > 0 ? Math.max(...ids) + 1 : 1
}

