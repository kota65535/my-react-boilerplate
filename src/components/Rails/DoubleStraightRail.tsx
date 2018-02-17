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
import * as _ from "lodash";
import {RailComponents} from "components/Rails/index";
import * as update from "immutability-helper";
import {JOINT_FILL_COLORS, RAIL_PART_FILL_COLORS} from "constants/parts";


interface DoubleStraightRailProps extends RailBaseProps {
  length: number
}

export type DoubleStraightRailComposedProps = DoubleStraightRailProps & WithHistoryProps


export class DoubleStraightRail extends RailBase<DoubleStraightRailComposedProps, {}> {
  public static NUM_RAIL_PARTS = 2
  public static NUM_JOINTS = 4
  public static PIVOT_JOINT_CHANGING_STRIDE = 2

  public static defaultProps: RailBaseDefaultProps = {
    type: 'DoubleStraightRail',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    hasOpposingJoints: new Array(DoubleStraightRail.NUM_JOINTS).fill(false)
  }

  constructor(props: DoubleStraightRailComposedProps) {
    super(props)

    this.temporaryPivotJointIndex = 0
    this.railParts = new Array(DoubleStraightRail.NUM_RAIL_PARTS).fill(null)
    this.joints = new Array(DoubleStraightRail.NUM_JOINTS).fill(null)
  }

  getJointPosition(jointId: number) {
    switch (jointId) {
      case 0:
        return this.railParts[0].startPoint
      case 1:
        return this.railParts[0].endPoint
      case 2:
        return this.railParts[1].startPoint
      case 3:
        return this.railParts[1].endPoint
      default:
        throw Error(`Invalid joint ID ${jointId}`)
    }
  }

  getJointAngle(jointId: number) {
    switch (jointId) {
      case 0:
        return this.railParts[0].startAngle + 180
      case 1:
        return this.railParts[0].endAngle
      case 2:
        return this.railParts[1].startAngle + 180
      case 3:
        return this.railParts[1].endAngle
      default:
        throw Error(`Invalid joint ID ${jointId}`)
    }
  }

  render() {
    const {
      position, length, angle, id, selected, pivotJointIndex, opacity,
      hasOpposingJoints
    } = this.props
    const jointAngles = [
      angle + 180,
      angle,
      angle + 180,
      angle
    ]

    const secondLineStartPosition = position.add(new Point(0, RailBase.RAIL_SPACE).rotate(angle, new Point(0,0)))

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
        <StraightRailPart
          position={secondLineStartPosition}
          angle={angle}
          length={length}
          pivot={Pivot.LEFT}
          selected={selected}
          opacity={opacity}
          name={'Rail'}
          data={{
            railId: id,
            partType: 'RailPart',
            partId: 1
          }}
          ref={(railPart) => this.railParts[1] = railPart}
        />
        {_.range(DoubleStraightRail.NUM_JOINTS).map(i => {
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
              fillColors={i === 0 ? RAIL_PART_FILL_COLORS : JOINT_FILL_COLORS}
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

export type DoubleStraightRailItemData = BaseItemData & DoubleStraightRailProps

export default connect(mapStateToProps, mapDispatchToProps)(compose<DoubleStraightRailProps, DoubleStraightRailProps>(
  withHistory
)(DoubleStraightRail))