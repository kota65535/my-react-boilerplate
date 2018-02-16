import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import StraightRailPart from "./parts/StraightRailPart";
import CurveRailPart from "./parts/CurveRailPart";
import Joint from "./parts/Joint";
import {Pivot} from "components/Rails/parts/primitives/PartBase";
import {BaseItemData, ItemData} from "reducers/layout";
import {PaletteItem, RootState} from "store/type";
import {default as withHistory, WithHistoryProps} from "components/hoc/withHistory";
import {connect} from "react-redux";
import {compose} from "recompose";
import {setTemporaryItem} from "actions/builder";
import {ArcDirection} from "components/Rails/parts/primitives/ArcPart";
import {
  mapDispatchToProps, mapStateToProps, RailBase, RailBaseDefaultProps,
  RailBaseProps
} from "components/Rails/RailBase";


interface SimpleTurnoutProps extends RailBaseProps {
  length: number
  radius: number
  centerAngle: number
  branchDirection: ArcDirection
}

export type SimpleTurnoutComposedProps = SimpleTurnoutProps & WithHistoryProps


export class SimpleTurnout extends RailBase<SimpleTurnoutComposedProps, {}> {
  public static NUM_RAIL_PARTS = 2
  public static NUM_JOINTS = 3

  public static defaultProps: RailBaseDefaultProps = {
    type: 'SimpleTurnout',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    hasOpposingJoints: new Array(SimpleTurnout.NUM_JOINTS).fill(false)
  }

  constructor(props: SimpleTurnoutComposedProps) {
    super(props)

    this.temporaryPivotJointIndex = 0
    this.railParts = new Array(SimpleTurnout.NUM_RAIL_PARTS).fill(null)
    this.joints = new Array(SimpleTurnout.NUM_JOINTS).fill(null)
  }

  getJointPosition(jointId: number) {
    switch (jointId) {
      case 0:
        return this.railParts[0].startPoint
      case 1:
        return this.railParts[0].endPoint
      case 2:
        return this.railParts[1].endPoint
      default:
        throw Error(`Invalid joint ID ${jointId}`)
    }
  }

  getJointAngle(jointId: number) {
    switch (jointId) {
      case 0:
        return this.railParts[0].startAngle - 180
      case 1:
        return this.railParts[0].endAngle
      case 2:
        return this.railParts[1].endAngle
      default:
        throw Error(`Invalid joint ID ${jointId}`)
    }
  }


  render() {
    const {
      position, length, angle, radius, centerAngle, branchDirection, id, selected, pivotJointIndex, opacity,
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
      <CurveRailPart
        radius={radius}
        centerAngle={centerAngle}
        direction={branchDirection}
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
        ref={(railPart) => this.railParts[1] = railPart}
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
        // onMouseLeave={this.onJointMouseLeave.bind(this, 0)}
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
        // onMouseLeave={this.onJointMouseLeave.bind(this, 1)}
        onMouseEnter={this.onJointMouseEnter.bind(this, 1)}
        ref={(joint) => this.joints[1] = joint}
      />,
      <Joint
        angle={branchDirection === ArcDirection.RIGHT ? angle + centerAngle : angle - centerAngle}
        position={position}
        opacity={opacity}
        name={'Rail'}
        data={{
          railId: id,
          partType: 'Joint',
          partId: 2
        }}
        hasOpposingJoint={hasOpposingJoints[2]}
        onLeftClick={this.onJointLeftClick.bind(this, 2)}
        onRightClick={this.onJointRightClick.bind(this,2)}
        // onMouseMove={this.onJointMouseMove.bind(this, 2)}
        // onMouseLeave={this.onJointMouseLeave.bind(this, 2)}
        onMouseEnter={this.onJointMouseEnter.bind(this, 2)}
        ref={(joint) => this.joints[2] = joint}
      />
    ]
  }
}

export type SimpleTurnoutItemData = BaseItemData & SimpleTurnoutProps

export default connect(mapStateToProps, mapDispatchToProps)(compose<SimpleTurnoutProps, SimpleTurnoutProps>(
  withHistory
)(SimpleTurnout))
