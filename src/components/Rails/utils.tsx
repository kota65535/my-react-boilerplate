import * as React from "react";
import RailContainers from "components/Rails/index";
import {ItemData} from "reducers/layout";

export const createRailComponent = (item: ItemData, addItem: any, updateItem: any) => {
  const {id: id, type: type, ...props} = item
  let RailComponent = RailContainers[type]
  // LOGGER.debug(props)
  return (
    <RailComponent
      key={id}
      id={id}
      {...props}
      // data={{ id: id, type: Type }}
      // (activeTool === Tools.SELECT)
      // (this.props.selectedItem.id === selectedItem || layer.id === selectedItem)
      addItem={addItem}
      updateItem={updateItem}
      ref={(c) => RAIL_COMPONENTS[id] = c}
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
    return (p1.x - p2.x < tolerance && p1.y - p2.y < tolerance)
  } else if (!p1 && !p2) {
    return true
  } else {
    return false
  }
}
