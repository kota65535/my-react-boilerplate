import {RootState} from "store/type";
import {LayoutData} from "reducers/layout";

export const currentLayoutData = (state: RootState): LayoutData => {
  return state.layout.histories[state.layout.historyIndex]
}

export const isLayoutEmpty = (state: RootState) => {
  return currentLayoutData(state).rails.length === 0
}

export const nextRailId = (state: RootState) => {
  let ids = currentLayoutData(state).rails.map(r => r.id)
  return ids.length > 0 ? Math.max(...ids) + 1 : 1
}

export const canUndo = (state: RootState) => {
  return state.layout.historyIndex > 0
}

export const canRedo = (state: RootState) => {
  return state.layout.histories.length > 1 && state.layout.historyIndex + 1 < state.layout.histories.length
}
