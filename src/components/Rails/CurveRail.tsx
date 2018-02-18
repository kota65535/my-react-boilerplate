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
  RailBaseProps, RailBaseState
} from "components/Rails/RailBase";
import * as _ from "lodash";


export interface CurveRailProps extends RailBaseProps {
  radius: number
  centerAngle: number
}

export type CurveRailComposedProps = CurveRailProps & WithHistoryProps


export class CurveRail extends RailBase<CurveRailComposedProps, RailBaseState> {
  public static NUM_RAIL_PARTS = 1
  public static NUM_JOINTS = 2
  public static PIVOT_JOINT_CHANGING_STRIDE = 1

  public static defaultProps: RailBaseDefaultProps = {
    type: 'CurveRail',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    hasOpposingJoints: new Array(CurveRail.NUM_JOINTS).fill(false),
  }

  constructor(props: CurveRailComposedProps) {
    super(props)
    this.state = {
      railPartsFixed: false
    }

    this.temporaryPivotJointIndex = this.props.pivotJointIndex
    this.railParts = new Array(CurveRail.NUM_RAIL_PARTS).fill(null)
    this.joints = new Array(CurveRail.NUM_JOINTS).fill(null)

  }

  getJointPositions() {
    if (this.state.railPartsFixed) {
      return [
        this.railParts[0].startPoint,
        this.railParts[0].endPoint
      ]
    } else {
      return new Array(CurveRail.NUM_JOINTS).fill(this.props.position)
    }
  }

  getJointAngles() {
    if (this.state.railPartsFixed) {
      return [
        this.railParts[0].startAngle + 180,
        this.railParts[0].endAngle
      ]
    } else {
      return [
        this.props.angle + 180,
        this.props.angle + this.props.centerAngle
      ]
    }
  }

  render() {
    const {
      position, angle, radius, centerAngle, id, selected, pivotJointIndex, opacity,
      hasOpposingJoints
    } = this.props

    const jointAngles = this.getJointAngles()
    const jointPositions = this.getJointPositions()


    return (
      <React.Fragment>
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
          onFixed={this.onRailPartFixed}
          ref={(railPart) => this.railParts[0] = railPart}
        />
        {_.range(CurveRail.NUM_JOINTS).map(i => {
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
              onFixed={this.onRailPartFixed}
              ref={(joint) => this.joints[i] = joint}
            />
          )
        })}
      </React.Fragment>
    )
  }
}

export type CurveRailItemData = BaseItemData & CurveRailProps

export default connect(mapStateToProps, mapDispatchToProps)(compose<CurveRailProps, CurveRailProps>(
  withHistory
)(CurveRail))
