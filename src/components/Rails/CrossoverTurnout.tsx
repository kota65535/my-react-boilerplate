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


interface CrossoverTurnoutProps extends RailBaseProps {
  length: number
}

export type CrossoverTurnoutComposedProps = CrossoverTurnoutProps & WithHistoryProps


export class CrossoverTurnout extends RailBase<CrossoverTurnoutComposedProps, RailBaseState> {
  public static NUM_RAIL_PARTS = 6
  public static NUM_JOINTS = 4
  public static PIVOT_JOINT_CHANGING_STRIDE = 2

  public static defaultProps: RailBaseDefaultProps = {
    type: 'CrossoverTurnout',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    hasOpposingJoints: new Array(CrossoverTurnout.NUM_JOINTS).fill(false)
  }

  constructor(props: CrossoverTurnoutComposedProps) {
    super(props)

    this.temporaryPivotJointIndex = 0
    this.railParts = new Array(CrossoverTurnout.NUM_RAIL_PARTS).fill(null)
    this.joints = new Array(CrossoverTurnout.NUM_JOINTS).fill(null)
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
      return new Array(CrossoverTurnout.NUM_JOINTS).fill(this.props.position)
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

    const firstLineEndPosition = position.add(new Point(length, 0).rotate(angle, new Point(0,0)))
    const secondLineStartPosition = position.add(new Point(0,  RailBase.RAIL_SPACE).rotate(angle, new Point(0,0)))
    const secondLineEndPosition = secondLineStartPosition.add(new Point(length, 0).rotate(angle, new Point(0,0)))

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
        <CurveRailPart
          radius={541}
          centerAngle={15}
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
          onFixed={this.onRailPartFixed}
          ref={(railPart) => this.railParts[2] = railPart}
        />
        <CurveRailPart
          radius={541}
          centerAngle={15}
          direction={ArcDirection.LEFT}
          position={firstLineEndPosition}
          angle={angle + 180}
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
          ref={(railPart) => this.railParts[3] = railPart}
        />
        <CurveRailPart
          radius={541}
          centerAngle={15}
          direction={ArcDirection.LEFT}
          position={secondLineStartPosition}
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
          ref={(railPart) => this.railParts[4] = railPart}
        />
        <CurveRailPart
          radius={541}
          centerAngle={15}
          direction={ArcDirection.RIGHT}
          position={secondLineEndPosition}
          angle={angle + 180}
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
          ref={(railPart) => this.railParts[5] = railPart}
        />
        {_.range(CrossoverTurnout.NUM_JOINTS).map(i => {
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

export type CrossoverTurnoutItemData = BaseItemData & CrossoverTurnoutProps

export default connect(mapStateToProps, mapDispatchToProps)(compose<CrossoverTurnoutProps, CrossoverTurnoutProps>(
  withHistory
)(CrossoverTurnout))
