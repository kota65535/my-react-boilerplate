import * as React from "react";
import RailContainers, {RailData, RailGroupData} from "components/rails/index";
import getLogger from "logging";
import {RailBase, RailBaseProps} from "components/rails/RailBase";
import RailGroup from "components/rails/RailGroup/RailGroup";
import {Point} from "paper";

const LOGGER = getLogger(__filename)


export const createRailOrRailGroupComponent = (railGroup: RailGroupData, rails: RailData[]) => {
  if (railGroup) {
    return createRailGroupComponent(railGroup, rails)
  } else {
    return (
      <React.Fragment>
        {rails.map(r => createRailComponent(r))}
      </React.Fragment>
    )
  }
}

/**
 * レールコンポーネントを生成する。
 * @param {RailData} item
 */
export const createRailComponent = (item: RailData) => {
  const {id: id, type: type, ...props} = item
  let RailContainer = RailContainers[type]
  if (RailContainer == null) {
    throw Error(`'${type}' is not a valid Rail type!`)
  }
  return (
    <RailContainer
      key={id}
      id={id}
      {...props}
      // data={{ id: id, type: Type }}
      // (activeTool === Tools.SELECT)
      // (this.props.selectedItem.id === selectedItem || layer.id === selectedItem)
      // HOCでラップされた中身のRailComponentを取得する
      onMount={(ref) => {
        window.RAIL_COMPONENTS[id] = ref
        LOGGER.info(`Rail added. id=${id}, ${ref.props.type}`)  //`
      }}
      onUnmount={(ref) => {
        LOGGER.info(`Rail deleted. id=${id}, ${ref.props.type}`)  //`
        delete window.RAIL_COMPONENTS[id]
      }}
    />)
}

export const createRailGroupComponent = (item: RailGroupData, children: RailData[]) => {
  const {id: id, type: type, ...props} = item
  if (type !== 'RailGroup') {
    throw Error(`'${type}' is not a RailGroup!`)
  }

  return (
    <RailGroup
      key={id}
      id={id}
      {...props}
      onMount={(ref) => {
        window.RAIL_COMPONENTS[id] = ref
        LOGGER.info(`RailGroup added. id=${id}, ${ref.props.type}`)  //`
      }}
      onUnmount={(ref) => {
        LOGGER.info(`RailGroup deleted. id=${id}, ${ref.props.type}`)  //`
        delete window.RAIL_COMPONENTS[id]
      }}
    >
      {children.map(rail => createRailComponent(rail))}
    </RailGroup>
  )
}




/**
 * Point同士を比較し、一致したらtrueを返す
 * @param p1 {Point}
 * @param p2 {Point}
 * @param {number} tolerance 許容誤差
 * @returns {boolean}
 */
export const pointsEqual = (p1, p2, tolerance = 0.0000001) => {
  if (p1 && p2) {
    return (Math.abs(p1.x - p2.x) < tolerance && Math.abs(p1.y - p2.y) < tolerance)
  } else if (!p1 && !p2) {
    return true
  } else {
    return false
  }
}

/**
 * Angle同士を比較し、一致したらtrueを返す
 * @param a1 {number}
 * @param a2 {number}
 * @param {number} tolerance 許容誤差
 * @returns {boolean}
 */
export const anglesEqual = (a1, a2, tolerance = 0.0000001) => {
  return Math.abs((a1 + 360) % 360 - (a2 + 360) % 360) < tolerance
}

// 上記メソッド、これで良かった説
// export const pointsReasonablyClose = (p1, p2, tolerance) => {
//   return p1.isClose(p2, 0.001)
// }


export const getRailComponent = (id: number): RailBase<RailBaseProps, any> => {
  return window.RAIL_COMPONENTS[id.toString()]
}

export const getTemporaryRailComponent = (): RailBase<RailBaseProps, any> => {
  return window.RAIL_COMPONENTS["-1"]
}

export const getAllRailComponents = (): Array<RailBase<RailBaseProps, any>> => {
  return Object.keys(window.RAIL_COMPONENTS).map(key => window.RAIL_COMPONENTS[key])
}

export const getRailComponentsOfLayer = (layerId: number): Array<RailBase<RailBaseProps, any>> => {
  return getAllRailComponents().filter(r => r.props.layerId === layerId)
}

