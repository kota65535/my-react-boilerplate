import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import Joint from "./RailParts/Joint";
import {connect} from "react-redux";
import {compose} from "recompose";
import {
  mapDispatchToProps,
  mapStateToProps,
  RailBase,
  RailBaseDefaultProps,
  RailBaseProps, RailBaseState
} from "components/Rails/RailBase";
import * as _ from "lodash";
import DoubleStraightRailPart from "components/Rails/RailParts/DoubleStraightRailPart";
import {default as withHistory, WithHistoryProps} from "components/hoc/withHistory";
import {BaseItemData} from "reducers/layout";


export interface DoubleStraightRailProps extends RailBaseProps {
  length: number
}


export type DoubleStraightRailComposedProps = DoubleStraightRailProps & WithHistoryProps


export class DoubleStraightRail extends RailBase<DoubleStraightRailComposedProps, RailBaseState> {

  public static NUM_JOINTS = 4
  public static PIVOT_JOINT_CHANGING_STRIDE = 1

  public static defaultProps: RailBaseDefaultProps = {
    type: 'DoubleStraightRail',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    hasOpposingJoints: new Array(DoubleStraightRail.NUM_JOINTS).fill(false),
    enableJoints: true
  }

  constructor(props: DoubleStraightRailComposedProps) {
    super(props)

    this.state = {
      jointPositions: new Array(DoubleStraightRail.NUM_JOINTS).fill(props.position),
      jointAngles: new Array(DoubleStraightRail.NUM_JOINTS).fill(props.angle)
    }
    this.temporaryPivotJointIndex = 0
    this.joints = new Array(DoubleStraightRail.NUM_JOINTS).fill(null)
  }


  render() {
    const {
      position, angle, length, id, selected, pivotJointIndex, opacity,
      hasOpposingJoints
    } = this.props

    return (
      <React.Fragment>
        <DoubleStraightRailPart
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
          onFixed={this.onRailPartFixed}
          ref={(railPart) => this.railPart = railPart}
        />
        {_.range(DoubleStraightRail.NUM_JOINTS).map(i => {
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
              detectionEnabled={this.props.enableJoints}
              hasOpposingJoint={hasOpposingJoints[i]}
              onLeftClick={this.onJointLeftClick.bind(this, i)}
              onRightClick={this.onJointRightClick.bind(this, i)}
              onMouseMove={this.onJointMouseMove.bind(this, i)}
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

export type StraightRailItemData = BaseItemData & DoubleStraightRailProps


export default connect(mapStateToProps, mapDispatchToProps)(compose<DoubleStraightRailProps, DoubleStraightRailProps>(
  withHistory
)(DoubleStraightRail))
