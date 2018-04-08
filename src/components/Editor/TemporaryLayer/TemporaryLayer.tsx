import * as React from "react";
import {Layer} from "react-paper-bindings";
import {createRailComponent} from "components/rails/utils";
import {RailData, RailGroupData} from "components/rails";
import RailGroup from "components/rails/RailGroup/RailGroup";
import getLogger from "logging";

const LOGGER = getLogger(__filename)

export interface TemporaryLayerProps {
  temporaryRails: RailData[]
  temporaryRailGroup: RailGroupData
}


export class TemporaryLayer extends React.Component<TemporaryLayerProps, {}> {
  render() {
    const {temporaryRails, temporaryRailGroup} = this.props
    return (
      <Layer
        key={-1}
        data={{id: -1, name: 'Temporary'}}
      >
        {this.props.temporaryRails.length > 0 &&
        createTemporayRailComponent(temporaryRails, temporaryRailGroup)}
      </Layer>
    )
  }
}

const createTemporayRailComponent = (temporaryRails: RailData[], temporaryRailGroup: RailGroupData) => {
  if (temporaryRailGroup) {
    const {id: id, type: type, ...props} = temporaryRailGroup
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
        {temporaryRails.map(rail => createRailComponent(rail))}
      </RailGroup>
    )
  } else {
    return (
      <React.Fragment>
        {temporaryRails.map(r => createRailComponent(r))}
      </React.Fragment>
    )
  }
}
