import * as React from "react";
import {Rectangle} from "react-paper-bindings";
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
import SimpleTurnoutRailPart from "components/Rails/RailParts/SimpleTurnoutRailPart";
import {default as withHistory, WithHistoryProps} from "components/hoc/withHistory";
import {BaseItemData} from "reducers/layout";


export interface SimpleTurnoutProps extends RailBaseProps {
  length: number
  radius: number
  centerAngle: number
  branchDirection: ArcDirection
}

export type SimpleTurnoutComposedProps = SimpleTurnoutProps & WithHistoryProps


export class SimpleTurnout extends RailBase<SimpleTurnoutComposedProps, RailBaseState> {
  public static NUM_JOINTS = 3
  public static PIVOT_JOINT_CHANGING_STRIDE = 1

  public static defaultProps: RailBaseDefaultProps = {
    type: 'SimpleTurnout',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    hasOpposingJoints: new Array(SimpleTurnout.NUM_JOINTS).fill(false),
  }

  constructor(props: SimpleTurnoutComposedProps) {
    super(props)
    this.state = {
      jointPositions: new Array(SimpleTurnout.NUM_JOINTS).fill(props.position),
      jointAngles: new Array(SimpleTurnout.NUM_JOINTS).fill(props.angle)
    }

    this.temporaryPivotJointIndex = this.props.pivotJointIndex
    this.joints = new Array(SimpleTurnout.NUM_JOINTS).fill(null)
  }

  render() {
    const {
      position, angle, length, radius, centerAngle, branchDirection, id, selected, pivotJointIndex, opacity,
      hasOpposingJoints
    } = this.props

    return (
      <React.Fragment>
        <SimpleTurnoutRailPart
          length={length}
          radius={radius}
          centerAngle={centerAngle}
          direction={branchDirection}
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
        {_.range(SimpleTurnout.NUM_JOINTS).map(i => {
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

export type SimpleTurnoutItemData = BaseItemData & SimpleTurnoutProps

export default connect(mapStateToProps, mapDispatchToProps)(compose<SimpleTurnoutProps, SimpleTurnoutProps>(
  withHistory
)(SimpleTurnout))
