import * as React from "react";
import {Layer} from "react-paper-bindings";
import {createRailComponent} from "components/rails/utils";
import {RailData} from "components/rails";
import {UserRailGroupData} from "reducers/builder";
import RailGroup from "components/rails/RailGroup/RailGroup";
import getLogger from "logging";

const LOGGER = getLogger(__filename)

export interface TemporaryLayerProps {
  temporaryItem: RailData
}


export class TemporaryLayer extends React.Component<TemporaryLayerProps, {}> {
  render() {
    return (
      <Layer
        key={-1}
        data={{id: -1, name: 'Temporary'}}
      >
        {this.props.temporaryItem &&
        createTemporayRailComponent(this.props.temporaryItem)}
      </Layer>
    )
  }
}

const createTemporayRailComponent = (item: RailData|UserRailGroupData) => {
  const {id: id, type: type, ...props} = item
  if (item.type === 'RailGroup') {
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
        {(item as UserRailGroupData).rails.map(rail => createRailComponent(rail))}
      </RailGroup>
    )
  } else {
    return createRailComponent(item)
  }
}
