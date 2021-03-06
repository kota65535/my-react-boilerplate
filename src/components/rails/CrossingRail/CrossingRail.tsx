import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import {RailBase, RailBaseDefaultProps, RailBaseProps, RailBaseState} from "components/rails/RailBase";
import CrossingRailPart from "components/rails/parts/CrossingRailPart";


export interface CrossingRailProps extends RailBaseProps {
  length: number
  crossAngle: number
}


export default class CrossingRail extends RailBase<CrossingRailProps, RailBaseState> {

  public static defaultProps: RailBaseDefaultProps = {
    ...RailBase.defaultProps,
    type: 'CrossingRail',
    numJoints: 4,
    pivotJointChangingStride: 2,
  }

  constructor(props: CrossingRailProps) {
    super(props)
    this.state = {
      jointPositions: new Array(this.props.numJoints).fill(props.position),
      jointAngles: new Array(this.props.numJoints).fill(props.angle),
    }
  }


  render() {
    const {
      position, angle, crossAngle, length, id, selected, pivotJointIndex, opacity, visible, fillColor
    } = this.props

    return (
      <React.Fragment>
        <CrossingRailPart
          length={length}
          position={position}
          angle={angle}
          crossAngle={crossAngle}
          pivotJointIndex={pivotJointIndex}
          selected={selected}
          opacity={opacity}
          visible={visible}
          fillColors={_.fill(Array(4),  fillColor)}
          data={{
            type: 'RailPart',
            railId: id,
            partId: 0,
          }}
          onLeftClick={this.props.onRailPartLeftClick}
          ref={this.getInstance}
        />
        {this.createJointComponents()}
      </React.Fragment>
    )
  }
}
