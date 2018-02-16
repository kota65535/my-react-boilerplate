import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import StraightRailPart from "./parts/StraightRailPart";
import Joint from "./parts/Joint";
import {Pivot} from "components/Rails/parts/primitives/PartBase";
import {BaseItemData, ItemData} from "reducers/layout";
import {PaletteItem} from "store/type";
import {connect} from "react-redux";
import {compose} from "recompose";
import {default as withHistory, WithHistoryProps} from "components/hoc/withHistory";
import {
  mapDispatchToProps,
  mapStateToProps,
  RailBase,
  RailBaseDefaultProps,
  RailBaseProps
} from "components/Rails/RailBase";


export interface StraightRailProps extends RailBaseProps {
  length: number
}

export interface StraightRailState {
  temporaryItemPivotIndex: number
}

export type StraightRailComposedProps = StraightRailProps & WithHistoryProps


export class StraightRail extends RailBase<StraightRailComposedProps, StraightRailState> {

  public static NUM_RAIL_PARTS = 1
  public static NUM_JOINTS = 2

  public static defaultProps: RailBaseDefaultProps = {
    type: 'StraightRail',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    hasOpposingJoints: new Array(StraightRail.NUM_JOINTS).fill(false)
  }

  constructor(props: StraightRailComposedProps) {
    super(props)

    this.temporaryPivotJointIndex = 0
    this.railParts = new Array(StraightRail.NUM_RAIL_PARTS).fill(null)
    this.joints = new Array(StraightRail.NUM_JOINTS).fill(null)
  }


  render() {
    const {
      position, angle, length, id, selected, pivotJointIndex, opacity,
      hasOpposingJoints
    } = this.props

    return [
      <StraightRailPart
        position={position}
        angle={angle}
        length={length}
        pivot={Pivot.LEFT}
        selected={selected}
        opacity={opacity}
        name={'Rail'}
        data={{
          railId: id,
          partType: 'RailPart',
          partId: 0
        }}
        ref={(railPart) => this.railParts[0] = railPart}
      />,
      <Joint
        angle={angle + 180}
        position={position}
        opacity={opacity}
        name={'Rail'}
        data={{
          railId: id,
          partType: 'Joint',
          partId: 0
        }}
        hasOpposingJoint={hasOpposingJoints[0]}
        onLeftClick={this.onJointLeftClick.bind(this, 0)}
        onRightClick={this.onJointRightClick.bind(this, 0)}
        // onMouseMove={this.onJointMouseMove.bind(this, 0)}
        onMouseEnter={this.onJointMouseEnter.bind(this, 0)}
        ref={(joint) => this.joints[0] = joint}
      />,
      <Joint
        angle={angle}
        position={position}
        opacity={opacity}
        name={'Rail'}
        data={{
          railId: id,
          partType: 'Joint',
          partId: 1
        }}
        hasOpposingJoint={hasOpposingJoints[1]}
        onLeftClick={this.onJointLeftClick.bind(this, 1)}
        onRightClick={this.onJointRightClick.bind(this, 1)}
        // onMouseMove={this.onJointMouseMove.bind(this, 1)}
        onMouseEnter={this.onJointMouseEnter.bind(this, 1)}
        ref={(joint) => this.joints[1] = joint}
      />
    ]
  }
}

export type StraightRailItemData = BaseItemData & StraightRailProps


export default connect(mapStateToProps, mapDispatchToProps)(compose<StraightRailProps, StraightRailProps>(
  withHistory
)(StraightRail))
