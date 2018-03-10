import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import CurveRailPart from "./RailParts/CurveRailPart";
import {connect} from "react-redux";
import {ArcDirection} from "./RailParts/Parts/ArcPart";
import {
  mapDispatchToProps,
  mapStateToProps,
  RailBase,
  RailBaseDefaultProps,
  RailBaseProps,
  RailBaseState
} from "./RailBase";
import {compose} from "recompose";
import withHistory, {WithHistoryProps} from "components/hoc/withHistory";


export interface CurveRailProps extends RailBaseProps {
  radius: number
  centerAngle: number
}

export type CurveRailComposedProps = CurveRailProps & WithHistoryProps


export class CurveRail extends RailBase<CurveRailComposedProps, RailBaseState> {
  public static NUM_JOINTS = 2
  public static defaultProps: RailBaseDefaultProps = {
    type: 'CurveRail',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    opposingJoints: new Array(CurveRail.NUM_JOINTS).fill(null),
    enableJoints: true
  }
  public static PIVOT_JOINT_CHANGING_STRIDE = 1

  constructor(props: CurveRailComposedProps) {
    super(props)
    this.state = {
      jointPositions: new Array(this.NUM_JOINTS).fill(props.position),
      jointAngles: new Array(this.NUM_JOINTS).fill(props.angle),
    }

    // カーブ系レールのジョイントに対して仮レールを設置する場合は向き(PivotJoint)を揃える
    this.temporaryPivotJointIndex = this.props.pivotJointIndex
  }

  get NUM_JOINTS() { return CurveRail.NUM_JOINTS }

  render() {
    const {
      position, angle, radius, centerAngle, id, selected, pivotJointIndex, opacity,
    } = this.props

    return (
      <React.Fragment>
        <CurveRailPart
          radius={radius}
          centerAngle={centerAngle}
          direction={ArcDirection.RIGHT}
          position={position}
          angle={angle}
          pivotJointIndex={pivotJointIndex}
          selected={selected}
          opacity={opacity}
          data={{
            railId: id,
            type: 'RailPart',
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


export default compose<CurveRailProps, CurveRailProps>(
  connect(mapStateToProps, mapDispatchToProps),
  withHistory
)(CurveRail)
