import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import StraightRailPart from "./RailParts/StraightRailPart";
import {connect} from "react-redux";
import {
  mapDispatchToProps,
  mapStateToProps,
  RailBase,
  RailBaseDefaultProps,
  RailBaseProps,
  RailBaseState
} from "components/Rails/RailBase";
import withHistory, {WithHistoryProps} from "components/hoc/withHistory";
import {compose} from "recompose";


export interface StraightRailProps extends RailBaseProps {
  length: number
}


export type StraightRailComposedProps = StraightRailProps & WithHistoryProps


export class StraightRail extends RailBase<StraightRailComposedProps, RailBaseState> {

  public static NUM_JOINTS = 2
  public static defaultProps: RailBaseDefaultProps = {
    type: 'StraightRail',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    hasOpposingJoints: new Array(StraightRail.NUM_JOINTS).fill(false),
    enableJoints: true
  }
  public static PIVOT_JOINT_CHANGING_STRIDE = 1

  constructor(props: StraightRailComposedProps) {
    super(props)

    this.state = {
      jointPositions: new Array(StraightRail.NUM_JOINTS).fill(props.position),
      jointAngles: new Array(StraightRail.NUM_JOINTS).fill(props.angle),
      selected: false
    }
    this.temporaryPivotJointIndex = 0
    this.joints = new Array(StraightRail.NUM_JOINTS).fill(null)
  }


  render() {
    const {
      position, angle, length, id, selected, pivotJointIndex, opacity,
    } = this.props

    return (
      <React.Fragment>
        <StraightRailPart
          length={length}
          position={position}
          angle={angle}
          pivotJointIndex={pivotJointIndex}
          selected={selected || this.state.selected}
          opacity={opacity}
          name={'Rail'}
          data={{
            railId: id,
            partType: 'RailPart',
            partId: 0
          }}
          onLeftClick={this.onRailPartLeftClick}
          ref={(railPart) => this.railPart = railPart}
        />
        {this.createJointComponents()}
      </React.Fragment>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(compose<StraightRailProps, StraightRailProps>(
  withHistory
)(StraightRail))
