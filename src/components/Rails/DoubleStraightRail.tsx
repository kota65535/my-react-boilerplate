import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import {connect} from "react-redux";
import {compose} from "recompose";
import {
  mapDispatchToProps,
  mapStateToProps,
  RailBase,
  RailBaseDefaultProps,
  RailBaseProps,
  RailBaseState
} from "components/Rails/RailBase";
import DoubleStraightRailPart from "components/Rails/RailParts/DoubleStraightRailPart";
import {default as withHistory, WithHistoryProps} from "components/hoc/withHistory";
import {default as withBuilder, WithBuilderPublicProps} from "components/hoc/withBuilder";


export interface DoubleStraightRailProps extends RailBaseProps {
  length: number
}


export type DoubleStraightRailComposedProps = DoubleStraightRailProps & WithHistoryProps & WithBuilderPublicProps


export class DoubleStraightRail extends RailBase<DoubleStraightRailComposedProps, RailBaseState> {

  public static NUM_JOINTS = 4
  public static defaultProps: RailBaseDefaultProps = {
    type: 'DoubleStraightRail',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    opposingJoints: new Array(DoubleStraightRail.NUM_JOINTS).fill(null),
    enableJoints: true
  }
  public static PIVOT_JOINT_CHANGING_STRIDE = 2

  constructor(props: DoubleStraightRailComposedProps) {
    super(props)
    this.state = {
      jointPositions: new Array(this.NUM_JOINTS).fill(props.position),
      jointAngles: new Array(this.NUM_JOINTS).fill(props.angle),
    }
  }

  get NUM_JOINTS() { return DoubleStraightRail.NUM_JOINTS }

  render() {
    const {
      position, angle, length, id, selected, pivotJointIndex, opacity,
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
          data={{
            type: 'RailPart',
            partId: 0,
            railId: id,
          }}
          onLeftClick={this.onRailPartLeftClick}
          ref={(railPart) => this.railPart = railPart}
        />
        {this.createJointComponents()}
      </React.Fragment>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(compose<DoubleStraightRailProps, DoubleStraightRailProps>(
  withHistory,
  // withBuilder
)(DoubleStraightRail))
