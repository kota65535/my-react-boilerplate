import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import {connect} from "react-redux";
import {compose} from "recompose";
import {
  mapDispatchToProps,
  mapStateToProps,
  RailBase,
  RailBaseDefaultProps,
  RailBaseProps,
  RailBaseState
} from "components/Rails/RailBase";
import DoubleCrossTurnoutPart from "components/Rails/RailParts/DoubleCrossTurnoutRailPart";
import {default as withHistory, WithHistoryProps} from "components/hoc/withHistory";
import {BaseItemData} from "reducers/layout";


export interface DoubleCrossTurnoutProps extends RailBaseProps {
  length: number
}


export type DoubleCrossTurnoutComposedProps = DoubleCrossTurnoutProps & WithHistoryProps


export class DoubleCrossTurnout extends RailBase<DoubleCrossTurnoutComposedProps, RailBaseState> {

  public static NUM_JOINTS = 4
  public static defaultProps: RailBaseDefaultProps = {
    type: 'DoubleCrossTurnout',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    hasOpposingJoints: new Array(DoubleCrossTurnout.NUM_JOINTS).fill(false),
    enableJoints: true
  }
  public static PIVOT_JOINT_CHANGING_STRIDE = 2

  constructor(props: DoubleCrossTurnoutComposedProps) {
    super(props)

    this.state = {
      jointPositions: new Array(DoubleCrossTurnout.NUM_JOINTS).fill(props.position),
      jointAngles: new Array(DoubleCrossTurnout.NUM_JOINTS).fill(props.angle)
    }
    this.temporaryPivotJointIndex = 0
    this.joints = new Array(DoubleCrossTurnout.NUM_JOINTS).fill(null)
  }


  render() {
    const {
      position, angle, length, id, selected, pivotJointIndex, opacity,
    } = this.props

    return (
      <React.Fragment>
        <DoubleCrossTurnoutPart
          length={length}
          position={position}
          angle={angle}
          pivotJointIndex={pivotJointIndex}
          selected={selected}
          opacity={opacity}
          name={'Rail'}
          data={{
            railId: id,
            partType: 'RailPart',
            partId: 0
          }}
          ref={(railPart) => this.railPart = railPart}
        />
        {this.createJointComponents()}
      </React.Fragment>
    )
  }
}


export type StraightRailItemData = BaseItemData & DoubleCrossTurnoutProps


export default connect(mapStateToProps, mapDispatchToProps)(compose<DoubleCrossTurnoutProps, DoubleCrossTurnoutProps>(
  withHistory
)(DoubleCrossTurnout))
