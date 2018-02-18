import {ItemData} from "reducers/layout";
import Rails from "components/Rails/index";
import * as React from "react";

export const createRailComponent = (item: ItemData, addItem: any, updateItem: any) => {
  const {id: id, type: type, ...props} = item
  let RailComponent = Rails[type]
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

// Point同士を比較し、一致したらtrueを返す
export const pointsEqual = (p1, p2) => {
  if (p1 && p2) {
    return (p1.x === p2.x && p1.y === p2.y)
  } else if (!p1 && !p2) {
    return true
  } else {
    return false
  }
}
