import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import StraightRailPart from "./RailParts/StraightRailPart";
import {RailBase, RailBaseDefaultProps, RailBaseProps, RailBaseState} from "components/Rails/RailBase";


export interface StraightRailProps extends RailBaseProps {
  length: number
}


export default class StraightRail extends RailBase<StraightRailProps, RailBaseState> {
  public static defaultProps: RailBaseDefaultProps = {
    ...RailBase.defaultProps,
    type: 'StraightRail',
    numJoints: 2,
    pivotJointChangingStride: 1,
    opposingJoints: new Array(2).fill(null),
  }

  constructor(props: StraightRailProps) {
    super(props)
    this.state = {
      jointPositions: new Array(this.props.numJoints).fill(props.position),
      jointAngles: new Array(this.props.numJoints).fill(props.angle),
    }
  }


  render() {
    const {
      position, angle, length, id, selected, pivotJointIndex, opacity, visible,
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
          visible={visible}
          data={{
            type: 'RailPart',
            railId: id,
            partId: 0,
          }}
          onLeftClick={this.props.onRailPartLeftClick}
          ref={(railPart) => this.railPart = railPart}
        />
        {this.createJointComponents()}
      </React.Fragment>
    )
  }
}
