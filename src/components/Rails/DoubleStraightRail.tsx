import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import {RailBase, RailBaseDefaultProps, RailBaseProps, RailBaseState} from "components/Rails/RailBase";
import DoubleStraightRailPart from "components/Rails/RailParts/DoubleStraightRailPart";


export interface DoubleStraightRailProps extends RailBaseProps {
  length: number
}


export default class DoubleStraightRail extends RailBase<DoubleStraightRailProps, RailBaseState> {

  public static defaultProps: RailBaseDefaultProps = {
    ...RailBase.defaultProps,
    type: 'DoubleStraightRail',
    numJoints: 4,
    pivotJointChangingStride: 2,
  }

  constructor(props: DoubleStraightRailProps) {
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
        <DoubleStraightRailPart
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
