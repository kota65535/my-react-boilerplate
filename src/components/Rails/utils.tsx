import {ItemData} from "reducers/layout";
import Rails from "components/Rails/index";
import * as React from "react";

export const createRailComponent = (item: ItemData, addItem: any) => {
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
      ref={(c) => RAIL_COMPONENTS[id] = c}
    />)
}
