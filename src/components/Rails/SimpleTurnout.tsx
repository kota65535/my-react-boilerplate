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
  RailBaseProps, RailBaseState
} from "components/Rails/RailBase";
import * as _ from "lodash";


interface SimpleTurnoutProps extends RailBaseProps {
  length: number
  radius: number
  centerAngle: number
  branchDirection: ArcDirection
}

export type SimpleTurnoutComposedProps = SimpleTurnoutProps & WithHistoryProps


export class SimpleTurnout extends RailBase<SimpleTurnoutComposedProps, RailBaseState> {
  public static NUM_RAIL_PARTS = 2
  public static NUM_JOINTS = 3
  public static PIVOT_JOINT_CHANGING_STRIDE = 1

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
    const jointAngles = [
      angle + 180,
      angle,
      branchDirection === ArcDirection.RIGHT ? angle + centerAngle : angle - centerAngle
    ]
    return (
      <React.Fragment>
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
        />
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
        />
        {_.range(SimpleTurnout.NUM_JOINTS).map(i => {
          return (
            <Joint
              angle={jointAngles[i]}
              position={position}
              opacity={opacity}
              name={'Rail'}
              data={{
                railId: id,
                partType: 'Joint',
                partId: i
              }}
              hasOpposingJoint={hasOpposingJoints[i]}
              onLeftClick={this.onJointLeftClick.bind(this, i)}
              onRightClick={this.onJointRightClick.bind(this, i)}
              // onMouseMove={this.onJointMouseMove.bind(this, i)}
              onMouseEnter={this.onJointMouseEnter.bind(this, i)}
              onMouseLeave={this.onJointMouseLeave.bind(this, i)}
              ref={(joint) => this.joints[i] = joint}
            />
          )
        })}
      </React.Fragment>
    )
  }
}

export type SimpleTurnoutItemData = BaseItemData & SimpleTurnoutProps

export default connect(mapStateToProps, mapDispatchToProps)(compose<SimpleTurnoutProps, SimpleTurnoutProps>(
  withHistory
)(SimpleTurnout))
