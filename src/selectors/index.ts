import {RootState} from "store/type";
import {LayoutData} from "reducers/layout";
import RailFactory from "components/rails/RailFactory";
import getLogger from "logging";
import {RailComponentClasses} from "components/rails";

const LOGGER = getLogger(__filename)

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

export const paletteRailData = (state: RootState) => {
  return RailFactory[state.builder.paletteItem.name]()
}

export const paletteUserRailGroupData = (state: RootState) => {
  const userRailGroupName = state.builder.paletteItem.name
  if (! userRailGroupName) {
    return null
  }
  return _.clone(state.builder.userRailGroups.find(rg => rg.name === userRailGroupName))
}


export const nextPivotJointInfo = (state: RootState|any) => {
  const temporaryRailGroup = state.builder.temporaryRailGroup
  const userRailGroupData = paletteUserRailGroupData(state)
  if (! (temporaryRailGroup && userRailGroupData)) {
    return { railId: 0, jointId: 0 }
  }
  const currentIndex = _.indexOf(userRailGroupData.openJoints, temporaryRailGroup.pivotJointInfo)
  const nextIndex = (currentIndex + 1) % userRailGroupData.openJoints.length
  return userRailGroupData.openJoints[nextIndex]
}


export const nextPivotJointIndex = (state: RootState|any) => {
  const temporaryRails = state.builder.temporaryRails
  if (temporaryRails.length !== 1) {
    return 0
  }
  const {type, pivotJointIndex} = temporaryRails[0]
  const {numJoints, pivotJointChangingStride} = RailComponentClasses[type].defaultProps
  return (pivotJointIndex + pivotJointChangingStride) % numJoints
}



/**
 * 仮レールの次のPivotJointIndexを返す。
 * @param {RootState | any} state
 * @returns {any}
 */
export const currentPivotJointIndex = (state: RootState|any) => {
  const temporaryRails = state.builder.temporaryRails
  if (temporaryRails.length !== 1) {
    return 0
  }
  const {pivotJointIndex} = temporaryRails[0]
  return pivotJointIndex
}
