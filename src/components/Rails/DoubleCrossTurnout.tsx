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
import DoubleCrossTurnoutPart from "components/Rails/RailParts/DoubleCrossTurnoutRailPart";
import {default as withBuilder, WithBuilderPublicProps} from "components/hoc/withBuilder";


export interface DoubleCrossTurnoutProps extends RailBaseProps {
  length: number
}


export type DoubleCrossTurnoutComposedProps = DoubleCrossTurnoutProps & WithBuilderPublicProps


export class DoubleCrossTurnout extends RailBase<DoubleCrossTurnoutComposedProps, RailBaseState> {

  public static NUM_JOINTS = 4
  public static defaultProps: RailBaseDefaultProps = {
    type: 'DoubleCrossTurnout',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    opposingJoints: new Array(DoubleCrossTurnout.NUM_JOINTS).fill(null),
    enableJoints: true
  }
  public static PIVOT_JOINT_CHANGING_STRIDE = 2

  constructor(props: DoubleCrossTurnoutComposedProps) {
    super(props)
    this.state = {
      jointPositions: new Array(this.NUM_JOINTS).fill(props.position),
      jointAngles: new Array(this.NUM_JOINTS).fill(props.angle),
    }
  }

  get NUM_JOINTS() { return DoubleCrossTurnout.NUM_JOINTS }

  render() {
    const {
      position, angle, length, id, selected, pivotJointIndex, opacity,
    } = this.props

    return (
      <React.Fragment>
        <DoubleCrossTurnoutPart
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
          ref={(railPart) => this.railPart = railPart}
        />
        {this.createJointComponents()}
      </React.Fragment>
    )
  }
}


export default compose<DoubleCrossTurnoutProps, DoubleCrossTurnoutProps>(
  withBuilder,
  connect(mapStateToProps, mapDispatchToProps, null, { withRef: true }),
)(DoubleCrossTurnout)
