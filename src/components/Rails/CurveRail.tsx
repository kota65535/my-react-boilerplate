import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import CurveRailPart from "./parts/CurveRailPart";
import Joint from "./parts/Joint";
import {Pivot} from "components/Rails/parts/primitives/PartBase";
import {BaseItemData, ItemData} from "reducers/layout";
import {PaletteItem} from "store/type";
import {default as withHistory, WithHistoryProps} from "components/hoc/withHistory";
import {connect} from "react-redux";
import {compose} from "recompose";
import {ArcDirection} from "components/Rails/parts/primitives/ArcPart";
import {
  mapDispatchToProps,
  mapStateToProps,
  RailBase,
  RailBaseDefaultProps,
  RailBaseProps
} from "components/Rails/RailBase";


export interface CurveRailProps extends RailBaseProps {
  radius: number
  centerAngle: number
}

export type CurveRailComposedProps = CurveRailProps & WithHistoryProps


export class CurveRail extends RailBase<CurveRailComposedProps, {}> {

  public static NUM_RAIL_PARTS = 1
  public static NUM_JOINTS = 2

  public static defaultProps: RailBaseDefaultProps = {
    type: 'CurveRail',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    hasOpposingJoints: new Array(CurveRail.NUM_JOINTS).fill(false),
  }

  constructor(props: CurveRailComposedProps) {
    super(props)

    this.temporaryPivotJointIndex = this.props.pivotJointIndex
    this.railParts = new Array(CurveRail.NUM_RAIL_PARTS).fill(null)
    this.joints = new Array(CurveRail.NUM_JOINTS).fill(null)
  }


  render() {
    const {
      position, angle, radius, centerAngle, id, selected, pivotJointIndex, opacity,
      hasOpposingJoints
    } = this.props
    return [
      <CurveRailPart
        radius={radius}
        centerAngle={centerAngle}
        direction={ArcDirection.RIGHT}
        position={position}
        angle={angle}
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
        angle={angle + centerAngle}
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

export type CurveRailItemData = BaseItemData & CurveRailProps

export default connect(mapStateToProps, mapDispatchToProps)(compose<CurveRailProps, CurveRailProps>(
  withHistory
)(CurveRail))
