import {ItemData} from "reducers/layout";
import {RootState} from "store/type";
import * as React from "react";
import {Layer} from "react-paper-bindings";
import {createRailComponent} from "components/Rails/utils";
import {connect} from "react-redux";
import {compose} from "recompose";
import withHistory, {WithHistoryProps} from "components/hoc/withHistory";

export interface TemporaryLayerProps {
  temporaryItem: ItemData
}

const mapStateToProps = (state: RootState) => {
  return {
    temporaryItem: state.builder.temporaryItem
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
  }
}

type ComposedProps = TemporaryLayerProps & WithHistoryProps


export class TemporaryLayer extends React.Component<ComposedProps, {}> {
  render() {
    return (
      <Layer
        key={-1}
        data={{id: -1, name: 'Temporary'}}
      >
        {this.props.temporaryItem &&
        createRailComponent(this.props.temporaryItem, this.props.addItem, this.props.updateItem)}
      </Layer>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose<TemporaryLayerProps, TemporaryLayerProps>(
  withHistory
)(TemporaryLayer))
