import {RootState} from "store/type";
import * as React from "react";
import {Layer} from "react-paper-bindings";
import {createRailComponent} from "components/Rails/utils";
import {connect} from "react-redux";
import {RailData} from "components/Rails";

export interface TemporaryLayerProps {
  temporaryItem: RailData
  // addRail: (item: RailData, overwrite?: boolean) => void
  // updateRail: (item: RailData, overwrite?: boolean) => void
}

const mapStateToProps = (state: RootState) => {
  return {
    temporaryItem: state.builder.temporaryItem
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    // addRail: (item: RailData, overwrite = false) => dispatch(addRail({item, overwrite})),
    // updateRail: (item: RailData, overwrite = false) => dispatch(updateRail({item, overwrite})),
  }
}

type ComposedProps = TemporaryLayerProps


export class TemporaryLayer extends React.Component<ComposedProps, {}> {
  render() {
    return (
      <Layer
        key={-1}
        data={{id: -1, name: 'Temporary'}}
      >
        {this.props.temporaryItem &&
        createRailComponent(this.props.temporaryItem)}
      </Layer>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TemporaryLayer)
