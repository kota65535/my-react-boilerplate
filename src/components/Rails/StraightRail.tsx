import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import StraightRailPart from "./parts/StraightRailPart";
import Joint from "./parts/Joint";
import {Pivot} from "components/Rails/parts/primitives/PartBase";
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
import {BaseItemData} from "reducers/layout";
import withHistory, {WithHistoryProps} from "components/hoc/withHistory";


export interface StraightRailProps extends RailBaseProps {
  length: number
}


export type StraightRailComposedProps = StraightRailProps & WithHistoryProps


export class StraightRail extends RailBase<StraightRailComposedProps, RailBaseState> {

  public static NUM_JOINTS = 2
  public static PIVOT_JOINT_CHANGING_STRIDE = 1


  public static defaultProps: RailBaseDefaultProps = {
    type: 'StraightRail',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    hasOpposingJoints: new Array(StraightRail.NUM_JOINTS).fill(false)
  }

  constructor(props: StraightRailComposedProps) {
    super(props)

    this.state = {
      jointPositions: new Array(StraightRail.NUM_JOINTS).fill(props.position)
    }
    this.temporaryPivotJointIndex = 0
    this.joints = new Array(StraightRail.NUM_JOINTS).fill(null)
  }


  render() {
    const {
      position, angle, length, id, selected, pivotJointIndex, opacity,
      hasOpposingJoints
    } = this.props

    return (
      <React.Fragment>
        <StraightRailPart
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
        {_.range(StraightRail.NUM_JOINTS).map(i => {
          return (
            <Joint
              angle={this.props.angle}
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

export type StraightRailItemData = BaseItemData & StraightRailProps


export default connect(mapStateToProps, mapDispatchToProps)(compose<StraightRailProps, StraightRailProps>(
  withHistory
)(StraightRail))
