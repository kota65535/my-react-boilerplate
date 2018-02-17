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
import {RailComponents} from "components/Rails/index";
import * as update from "immutability-helper";
import {JOINT_FILL_COLORS, RAIL_PART_FILL_COLORS} from "constants/parts";
import {StraightRail} from "components/Rails/StraightRail";


interface DoubleStraightRailProps extends RailBaseProps {
  length: number
}

export type DoubleStraightRailComposedProps = DoubleStraightRailProps & WithHistoryProps


export class DoubleStraightRail extends RailBase<DoubleStraightRailComposedProps, RailBaseState> {
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
    this.state = {
      railPartsFixed: false
    }

    this.temporaryPivotJointIndex = 0
    this.railParts = new Array(DoubleStraightRail.NUM_RAIL_PARTS).fill(null)
    this.joints = new Array(DoubleStraightRail.NUM_JOINTS).fill(null)
  }

  getJointPositions() {
    if (this.state.railPartsFixed) {
      return [
        this.railParts[0].startPoint,
        this.railParts[0].endPoint,
        this.railParts[1].startPoint,
        this.railParts[1].endPoint
      ]
    } else {
      return new Array(StraightRail.NUM_JOINTS).fill(this.props.position)
    }
  }

  getJointAngles() {
    const {angle} = this.props
    return [
      angle + 180,
      angle,
      angle + 180,
      angle
    ]
  }

  render() {
    const {
      position, length, angle, id, selected, pivotJointIndex, opacity,
      hasOpposingJoints
    } = this.props

    const secondLineStartPosition = position.add(new Point(0, RailBase.RAIL_SPACE).rotate(angle, new Point(0,0)))

    const jointAngles = this.getJointAngles()
    const jointPositions = this.getJointPositions()

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
          onFixed={this.onRailPartFixed}
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
          onFixed={this.onRailPartFixed}
          ref={(railPart) => this.railParts[1] = railPart}
        />
        {_.range(DoubleStraightRail.NUM_JOINTS).map(i => {
          return (
            <Joint
              angle={jointAngles[i]}
              position={jointPositions[i]}
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

export type DoubleStraightRailItemData = BaseItemData & DoubleStraightRailProps

export default connect(mapStateToProps, mapDispatchToProps)(compose<DoubleStraightRailProps, DoubleStraightRailProps>(
  withHistory
)(DoubleStraightRail))
