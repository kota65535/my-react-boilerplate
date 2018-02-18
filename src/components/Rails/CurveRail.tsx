import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import CurveRailPart from "./RailParts/CurveRailPart";
import Joint from "./RailParts/Joint";
import {Pivot} from "components/Rails/RailParts/Parts/PartBase";
import {connect} from "react-redux";
import {compose} from "recompose";
import {ArcDirection} from "components/Rails/RailParts/Parts/ArcPart";
import {
  mapDispatchToProps,
  mapStateToProps,
  RailBase,
  RailBaseDefaultProps,
  RailBaseProps, RailBaseState
} from "components/Rails/RailBase";
import * as _ from "lodash";
import {BaseItemData} from "reducers/layout";
import withHistory, {WithHistoryProps} from "components/hoc/withHistory";


export interface CurveRailProps extends RailBaseProps {
  radius: number
  centerAngle: number
}

export type CurveRailComposedProps = CurveRailProps & WithHistoryProps


export class CurveRail extends RailBase<CurveRailComposedProps, RailBaseState> {
  public static NUM_JOINTS = 2
  public static PIVOT_JOINT_CHANGING_STRIDE = 1

  public static defaultProps: RailBaseDefaultProps = {
    type: 'CurveRail',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    hasOpposingJoints: new Array(CurveRail.NUM_JOINTS).fill(false),
  }

  constructor(props: CurveRailComposedProps) {
    super(props)
    this.state = {
      jointPositions: new Array(CurveRail.NUM_JOINTS).fill(props.position),
      jointAngles: new Array(CurveRail.NUM_JOINTS).fill(props.angle)
    }

    this.temporaryPivotJointIndex = this.props.pivotJointIndex
    this.joints = new Array(CurveRail.NUM_JOINTS).fill(null)
  }

  render() {
    const {
      position, angle, radius, centerAngle, id, selected, pivotJointIndex, opacity,
      hasOpposingJoints
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
          name={'Rail'}
          data={{
            railId: id,
            partType: 'RailPart',
            partId: 0
          }}
          onFixed={this.onRailPartFixed}
          ref={(railPart) => this.railPart = railPart}
        />
        {_.range(CurveRail.NUM_JOINTS).map(i => {
          return (
            <Joint
              angle={this.state.jointAngles[i]}
              position={this.state.jointPositions[i]}
              opacity={opacity}
              name={'Rail'}
              data={{
                railId: id,
                partType: 'Joint',
                partId: i
              }}
              hasOpposingJoint={hasOpposingJoints[i]}
              onLeftClick={this.onJointLeftClick.bind(this, i)}
              onRightClick={this.onJointRightClick.bind(this, i)}
              // onMouseMove={this.onJointMouseMove.bind(this, i)}
              onMouseEnter={this.onJointMouseEnter.bind(this, i)}
              onMouseLeave={this.onJointMouseLeave.bind(this, i)}
              onFixed={this.onJointsFixed}
              ref={(joint) => this.joints[i] = joint}
            />
          )
        })}
      </React.Fragment>
    )
  }
}

export type CurveRailItemData = BaseItemData & CurveRailProps

export default connect(mapStateToProps, mapDispatchToProps)(compose<CurveRailProps, CurveRailProps>(
  withHistory
)(CurveRail))
