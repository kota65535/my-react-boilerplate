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


interface ThreeWayTurnoutProps extends RailBaseProps {
  length: number
  leftStart: number
  leftRadius: number
  leftCenterAngle: number
  rightStart: number
  rightRadius: number
  rightCenterAngle: number
}

export type ThreeWayTurnoutComposedProps = ThreeWayTurnoutProps & WithHistoryProps


export class ThreeWayTurnout extends RailBase<ThreeWayTurnoutComposedProps, RailBaseState> {
  public static NUM_RAIL_PARTS = 3
  public static NUM_JOINTS = 4
  public static PIVOT_JOINT_CHANGING_STRIDE = 1

  public static defaultProps: RailBaseDefaultProps = {
    type: 'ThreeWayTurnout',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    hasOpposingJoints: new Array(ThreeWayTurnout.NUM_JOINTS).fill(false)
  }

  constructor(props: ThreeWayTurnoutComposedProps) {
    super(props)
    this.state = {
      railPartsFixed: false
    }

    this.temporaryPivotJointIndex = 0
    this.railParts = new Array(ThreeWayTurnout.NUM_RAIL_PARTS).fill(null)
    this.joints = new Array(ThreeWayTurnout.NUM_JOINTS).fill(null)
  }

  getJointPositions() {
    if (this.state.railPartsFixed) {
      return [
        this.railParts[0].startPoint,
        this.railParts[1].endPoint,
        this.railParts[0].endPoint,
        this.railParts[2].endPoint
      ]
    } else {
      return new Array(ThreeWayTurnout.NUM_JOINTS).fill(this.props.position)
    }
  }

  getJointAngles() {
    const {angle, leftCenterAngle, rightCenterAngle} = this.props
    return [
      angle + 180,
      angle - leftCenterAngle,
      angle,
      angle + rightCenterAngle
    ]
  }

  render() {
    const {
      position, length, angle, leftStart, leftRadius, leftCenterAngle, rightStart, rightRadius, rightCenterAngle, id, selected, pivotJointIndex, opacity,
      hasOpposingJoints
    } = this.props

    const leftStartPosition = position.add(new Point(leftStart, 0).rotate(angle, new Point(0, 0)))
    const rightStartPosition = position.add(new Point(rightStart, 0).rotate(angle, new Point(0, 0)))

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
        <CurveRailPart
          radius={leftRadius}
          centerAngle={leftCenterAngle}
          direction={ArcDirection.LEFT}
          position={leftStartPosition}
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
          onFixed={this.onRailPartFixed}
          ref={(railPart) => this.railParts[1] = railPart}
        />
        <CurveRailPart
          radius={rightRadius}
          centerAngle={rightCenterAngle}
          direction={ArcDirection.RIGHT}
          position={rightStartPosition}
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
          onFixed={this.onRailPartFixed}
          ref={(railPart) => this.railParts[2] = railPart}
        />
        {_.range(ThreeWayTurnout.NUM_JOINTS).map(i => {
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

export type ThreeWayTurnoutItemData = BaseItemData & ThreeWayTurnoutProps

export default connect(mapStateToProps, mapDispatchToProps)(compose<ThreeWayTurnoutProps, ThreeWayTurnoutProps>(
  withHistory
)(ThreeWayTurnout))
