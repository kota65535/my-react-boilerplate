import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import {RailBase, RailBaseDefaultProps, RailBaseProps, RailBaseState} from "components/rails/RailBase";
import DoubleCurveRailPart from "components/rails/parts/DoubleCurveRailPart";
import {ArcDirection} from "components/rails/parts/primitives/ArcPart";


export interface DoubleCurveRailProps extends RailBaseProps {
  innerRadius: number
  outerRadius: number
  centerAngle: number
}


export default class DoubleCurveRail extends RailBase<DoubleCurveRailProps, RailBaseState> {

  public static defaultProps: RailBaseDefaultProps = {
    ...RailBase.defaultProps,
    type: 'DoubleCurveRail',
    numJoints: 4,
    pivotJointChangingStride: 2,
  }

  constructor(props: DoubleCurveRailProps) {
    super(props)
    this.state = {
      jointPositions: new Array(this.props.numJoints).fill(props.position),
      jointAngles: new Array(this.props.numJoints).fill(props.angle),
    }
  }


  render() {
    const {
      position, angle, innerRadius, outerRadius, centerAngle, id, selected, pivotJointIndex, opacity, visible, fillColor
    } = this.props

    return (
      <React.Fragment>
        <DoubleCurveRailPart
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          centerAngle={centerAngle}
          direction={ArcDirection.RIGHT}
          position={position}
          angle={angle}
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
