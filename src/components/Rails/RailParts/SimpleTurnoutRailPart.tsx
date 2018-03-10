import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import RectPart from "./Parts/RectPart";
import DetectablePart from "./Parts/DetectablePart";
import ArcPart, {ArcDirection} from "./Parts/ArcPart";
import {RAIL_PART_FILL_COLORS, RAIL_PART_WIDTH} from "constants/parts";
import {Pivot} from "components/Rails/RailParts/Parts/PartBase";
import getLogger from "logging";
import PartGroup from "components/Rails/RailParts/Parts/PartGroup";
import RailPartBase, {RailPartBaseDefaultProps, RailPartBaseProps} from "components/Rails/RailParts/RailPartBase";

const LOGGER = getLogger(__filename)


interface SimpleTurnoutRailPartProps extends RailPartBaseProps {
  length: number
  radius: number
  centerAngle: number
  direction: ArcDirection
}


export default class SimpleTurnoutRailPart extends RailPartBase<SimpleTurnoutRailPartProps, {}> {
  public static defaultProps: RailPartBaseDefaultProps = {
    position: new Point(0, 0),
    angle: 0,
    pivotJointIndex: 0,
    detectionEnabled: false,
    selected: false,
    opacity: 1,
    fillColors: RAIL_PART_FILL_COLORS
  }

  pivots = [
    {pivotPartIndex: 0, pivot: Pivot.LEFT},
    {pivotPartIndex: 0, pivot: Pivot.RIGHT},
    {pivotPartIndex: 1, pivot: Pivot.RIGHT}
  ]

  angles = [
    () => this.props.angle,
    () => this.props.angle + 180,
    () => {
      switch (this.props.direction) {
        case ArcDirection.RIGHT:
          return this.props.angle - this.props.centerAngle + 180
        case ArcDirection.LEFT:
          return this.props.angle + this.props.centerAngle - 180
      }
    }
  ]

  constructor(props: SimpleTurnoutRailPartProps) {
    super(props)
  }

  getPivot(jointIndex: number) {
    return this.pivots[jointIndex]
  }

  getAngle(jointIndex: number) {
    return this.angles[jointIndex]()
  }

  render() {
    const {
      length, radius, centerAngle, position, direction, pivotJointIndex, detectionEnabled, selected, fillColors, opacity,
      name, data, onLeftClick, onRightClick
    } = this.props

    const {pivotPartIndex, pivot} = this.getPivot(pivotJointIndex)

    const part = (
      <PartGroup
        pivotPartIndex={pivotPartIndex}
        pivot={pivot}
      >
        <RectPart
          width={length}
          height={RAIL_PART_WIDTH}
          pivot={Pivot.LEFT}
          data={{
            type: 'Part'
          }}
        />
        <ArcPart
          direction={direction}
          radius={radius}
          centerAngle={centerAngle}
          width={RAIL_PART_WIDTH}
          pivot={Pivot.LEFT}
          data={{
            type: 'Part'
          }}
        />
      </PartGroup>
    )

    return (
      <DetectablePart
        mainPart={part}
        detectionPart={part}
        position={position}
        angle={this.getAngle(pivotJointIndex)}
        pivot={pivot}
        pivotPartIndex={0}
        fillColors={fillColors}
        detectionEnabled={detectionEnabled}
        name={name}
        data={data}
        onLeftClick={onLeftClick}
        onRightClick={onRightClick}
        selected={selected}
        ref={(part) => this.detectablePart = part}
      />
    )
  }
}
