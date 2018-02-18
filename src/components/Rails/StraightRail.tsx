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
  RailBaseProps, RailBaseState
} from "components/Rails/RailBase";
import * as _ from "lodash";


export interface StraightRailProps extends RailBaseProps {
  length: number
}


export type StraightRailComposedProps = StraightRailProps & WithHistoryProps


export class StraightRail extends RailBase<StraightRailComposedProps, RailBaseState> {

  public static NUM_RAIL_PARTS = 1
  public static NUM_JOINTS = 2
  public static PIVOT_JOINT_CHANGING_STRIDE = 1


  public static defaultProps: RailBaseDefaultProps = {
    type: 'StraightRail',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    hasOpposingJoints: new Array(StraightRail.NUM_JOINTS).fill(false)
  }

  constructor(props: StraightRailComposedProps) {
    super(props)
    this.state = {
      railPartsFixed: false
    }

    this.temporaryPivotJointIndex = 0
    this.railParts = new Array(StraightRail.NUM_RAIL_PARTS).fill(null)
    this.joints = new Array(StraightRail.NUM_JOINTS).fill(null)
  }

  getJointPositions() {
    if (this.state.railPartsFixed) {
      return [
        this.railParts[0].startPoint,
        this.railParts[0].endPoint
      ]
    } else {
      return new Array(StraightRail.NUM_JOINTS).fill(this.props.position)
    }
  }

  getJointAngles() {
    if (this.state.railPartsFixed) {
      return [
        // this.railParts[0].startAngle + 180,
        // this.railParts[0].endAngle
        this.props.angle + 180,
        this.props.angle
      ]
    } else {
      return [
        this.props.angle + 180,
        this.props.angle
      ]
    }
  }

  render() {
    const {
      position, angle, length, id, selected, pivotJointIndex, opacity,
      hasOpposingJoints
    } = this.props

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
        {_.range(StraightRail.NUM_JOINTS).map(i => {
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

export type StraightRailItemData = BaseItemData & StraightRailProps


export default connect(mapStateToProps, mapDispatchToProps)(compose<StraightRailProps, StraightRailProps>(
  withHistory
)(StraightRail))
