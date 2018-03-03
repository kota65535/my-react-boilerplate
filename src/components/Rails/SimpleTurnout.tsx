import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import Joint from "./RailParts/Joint";
import {connect} from "react-redux";
import {compose} from "recompose";
import {ArcDirection} from "components/Rails/RailParts/Parts/ArcPart";
import {
  mapDispatchToProps,
  mapStateToProps,
  RailBase,
  RailBaseDefaultProps,
  RailBaseProps,
  RailBaseState
} from "components/Rails/RailBase";
import * as _ from "lodash";
import SimpleTurnoutRailPart from "components/Rails/RailParts/SimpleTurnoutRailPart";
import {default as withHistory, WithHistoryProps} from "components/hoc/withHistory";


export interface SimpleTurnoutProps extends RailBaseProps {
  length: number
  radius: number
  centerAngle: number
  branchDirection: ArcDirection
}

export type SimpleTurnoutComposedProps = SimpleTurnoutProps & WithHistoryProps


export class SimpleTurnout extends RailBase<SimpleTurnoutComposedProps, RailBaseState> {
  public static NUM_JOINTS = 3
  public static defaultProps: RailBaseDefaultProps = {
    type: 'SimpleTurnout',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    opposingJoints: new Array(SimpleTurnout.NUM_JOINTS).fill(null),
    enableJoints: true
  }
  public static PIVOT_JOINT_CHANGING_STRIDE = 1

  constructor(props: SimpleTurnoutComposedProps) {
    super(props)
    this.state = {
      jointPositions: new Array(this.NUM_JOINTS).fill(props.position),
      jointAngles: new Array(this.NUM_JOINTS).fill(props.angle),
    }
  }

  get NUM_JOINTS() { return SimpleTurnout.NUM_JOINTS }


  render() {
    const {
      position, angle, length, radius, centerAngle, branchDirection, id, selected, pivotJointIndex, opacity,
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
          onLeftClick={this.onRailPartLeftClick}
          ref={(railPart) => this.railPart = railPart}
        />
        {this.createJointComponents()}
      </React.Fragment>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(compose<SimpleTurnoutProps, SimpleTurnoutProps>(
  withHistory
)(SimpleTurnout))
