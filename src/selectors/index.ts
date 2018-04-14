import {RootState} from "store/type";
import {LayoutData} from "reducers/layout";

export const currentLayoutDataString = (state: RootState) => {
  return JSON.stringify(state.layout.histories[state.layout.historyIndex])
}

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

export const nextRailGroupId = (state: RootState) => {
  let ids = currentLayoutData(state).railGroups.map(r => r.id)
  return ids.length > 0 ? Math.max(...ids) + 1 : 1
}

export const nextLayerId = (state: RootState) => {
  let ids = currentLayoutData(state).layers.map(r => r.id)
  return ids.length > 0 ? Math.max(...ids) + 1 : 1
}

export const canUndo = (state: RootState) => {
  return state.layout.historyIndex > 0
}

export const canRedo = (state: RootState) => {
  return state.layout.histories.length > 1 && state.layout.historyIndex + 1 < state.layout.histories.length
}

export const temporaryPivotJointIndex = (state: RootState|any) => {
  const {temporaryRails, temporaryRailGroup} = state.builder
  if (temporaryRailGroup) {
    return temporaryRailGroup.pivotJointIndex
    // return temporaryRails[temporaryRailGroup.pivotRailIndex].pivotJointIndex
  } else if (temporaryRails.length > 0) {
    return temporaryRails[0].pivotJointIndex
  } else {
    return null
  }
}
