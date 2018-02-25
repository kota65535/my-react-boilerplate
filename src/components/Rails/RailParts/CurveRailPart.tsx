import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import DetectablePart from "./Parts/DetectablePart";
import ArcPart, {ArcDirection} from "./Parts/ArcPart";
import {RAIL_PART_FILL_COLORS, RAIL_PART_WIDTH} from "constants/parts";
import {Pivot} from "components/Rails/RailParts/Parts/PartBase";
import getLogger from "logging";
import PartGroup from "components/Rails/RailParts/Parts/PartGroup";
import {
  default as RailPartBase,
  RailPartBaseDefaultProps,
  RailPartBaseProps
} from "components/Rails/RailParts/RailPartBase";

const LOGGER = getLogger(__filename)


interface CurveRailPartProps extends RailPartBaseProps {
  radius: number
  centerAngle: number
  direction: ArcDirection
}


export default class CurveRailPart extends RailPartBase<CurveRailPartProps, {}> {
  public static defaultProps: RailPartBaseDefaultProps = {
    position: new Point(0, 0),
    angle: 0,
    pivotJointIndex: 0,
    detectionEnabled: false,
    selected: false,
    opacity: 1,
    fillColors: RAIL_PART_FILL_COLORS
  }

  detectablePart: DetectablePart

  // Pivotにするジョイントの位置を指定するための情報
  pivots = [
    {pivotPartIndex: 0, pivot: Pivot.LEFT},
    {pivotPartIndex: 0, pivot: Pivot.RIGHT},
  ]

  // Pivotジョイントに応じて変わるレールの角度
  angles = [
    () => this.props.angle,
    () => {
      switch (this.props.direction) {
        case ArcDirection.RIGHT:
          return this.props.angle - this.props.centerAngle + 180
        case ArcDirection.LEFT:
          return this.props.angle + this.props.centerAngle - 180
      }
    }
  ]

  constructor(props: CurveRailPartProps) {
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
      radius, centerAngle, position, direction, pivotJointIndex, detectionEnabled, selected, fillColors, opacity,
      name, data, onLeftClick, onRightClick, onFixed
    } = this.props

    const {pivotPartIndex, pivot} = this.getPivot(pivotJointIndex)

    const part = (
      <PartGroup
        pivotPartIndex={pivotPartIndex}
        pivot={pivot}
      >
        <ArcPart
          pivot={Pivot.LEFT}
          direction={direction}
          radius={radius}
          centerAngle={centerAngle}
          width={RAIL_PART_WIDTH}
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
        onFixed={onFixed}
        ref={(part) => this.detectablePart = part}
      />
    )
  }
}
