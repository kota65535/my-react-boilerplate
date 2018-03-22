import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import {ArcDirection} from "components/Rails/RailParts/Parts/ArcPart";
import {RailBase, RailBaseDefaultProps, RailBaseProps, RailBaseState} from "components/Rails/RailBase";
import SimpleTurnoutRailPart from "components/Rails/RailParts/SimpleTurnoutRailPart";


export interface SimpleTurnoutProps extends RailBaseProps {
  length: number
  radius: number
  centerAngle: number
  branchDirection: ArcDirection
}


export default class SimpleTurnout extends RailBase<SimpleTurnoutProps, RailBaseState> {
  public static defaultProps: RailBaseDefaultProps = {
    ...RailBase.defaultProps,
    type: 'SimpleTurnout',
    numJoints: 3,
    pivotJointChangingStride: 1,
    opposingJoints: new Array(3).fill(null),
  }

  constructor(props: SimpleTurnoutProps) {
    super(props)
    this.state = {
      jointPositions: new Array(this.props.numJoints).fill(props.position),
      jointAngles: new Array(this.props.numJoints).fill(props.angle),
    }
  }


  render() {
    const {
      position, angle, length, radius, centerAngle, branchDirection, id, selected, pivotJointIndex, opacity, visible,
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
          visible={visible}
          data={{
            type: 'RailPart',
            railId: id,
            partId: 0
          }}
          onLeftClick={this.props.onRailPartLeftClick}
          ref={(railPart) => this.railPart = railPart}
        />
        {this.createJointComponents()}
      </React.Fragment>
    )
  }
}
