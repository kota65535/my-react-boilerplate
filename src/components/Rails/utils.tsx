import * as React from "react";
import RailContainers, {RailData} from "components/Rails/index";
import getLogger from "logging";

const LOGGER = getLogger(__filename)

/**
 * レールコンポーネントを生成する。
 * @param {RailData} item
 * @param addItem
 * @param updateItem
 * @returns {any}
 */
export const createRailComponent = (item: RailData) => {
  const {id: id, type: type, ...props} = item
  let RailContainer = RailContainers[type]
  if (RailContainer == null) {
    throw Error(`'${type}' is not a valid rail type!`)
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
      refInstance={(i) => {
        window.RAIL_COMPONENTS[id] = i
      }}
    />)
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

// 上記メソッド、これで良かった説
// export const pointsReasonablyClose = (p1, p2, tolerance) => {
//   return p1.isClose(p2, 0.001)
// }
