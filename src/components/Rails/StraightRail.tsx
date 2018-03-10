import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import StraightRailPart from "./RailParts/StraightRailPart";
import {connect} from "react-redux";
import {
  mapDispatchToProps,
  mapStateToProps,
  RailBase,
  RailBaseDefaultProps,
  RailBaseProps,
  RailBaseState
} from "components/Rails/RailBase";
import withHistory, {WithHistoryProps, WithHistoryPublicProps} from "components/hoc/withHistory";
import {compose} from "recompose";


export interface StraightRailProps extends RailBaseProps {
  length: number
}


export type StraightRailComposedProps = StraightRailProps & WithHistoryProps


export class StraightRail extends RailBase<StraightRailComposedProps, RailBaseState> {

  public static NUM_JOINTS = 2
  public static defaultProps: RailBaseDefaultProps = {
    type: 'StraightRail',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    opposingJoints: new Array(StraightRail.NUM_JOINTS).fill(null),
    enableJoints: true
  }
  public static PIVOT_JOINT_CHANGING_STRIDE = 1

  constructor(props: StraightRailComposedProps) {
    super(props)
    this.state = {
      jointPositions: new Array(this.NUM_JOINTS).fill(props.position),
      jointAngles: new Array(this.NUM_JOINTS).fill(props.angle),
    }
  }

  get NUM_JOINTS() { return StraightRail.NUM_JOINTS }


  render() {
    const {
      position, angle, length, id, selected, pivotJointIndex, opacity,
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

export default compose<StraightRailProps, StraightRailProps>(
  connect(mapStateToProps, mapDispatchToProps, null, { withRef: true }),
  withHistory
)(StraightRail)

// export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(compose<StraightRailProps, StraightRailProps>(
//   withHistory
// )(StraightRail))
