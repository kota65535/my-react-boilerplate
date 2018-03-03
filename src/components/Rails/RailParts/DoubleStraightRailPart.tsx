import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import RectPart from "./Parts/RectPart";
import DetectablePart from "./Parts/DetectablePart";
import {RAIL_PART_FILL_COLORS, RAIL_PART_WIDTH} from "constants/parts";
import {Pivot} from "components/Rails/RailParts/Parts/PartBase";
import {RailPartInfo} from "components/Rails/RailParts/types";
import getLogger from "logging";
import PartGroup from "components/Rails/RailParts/Parts/PartGroup";
import {
  default as RailPartBase,
  RailPartBaseDefaultProps,
  RailPartBaseProps
} from "components/Rails/RailParts/RailPartBase";

const LOGGER = getLogger(__filename)


interface DoubleStraightRailPartProps extends RailPartBaseProps {
  length: number
  name?: string
  data?: RailPartInfo
  onLeftClick?: (e: MouseEvent) => void
  onRightClick?: (e: MouseEvent) => void
}


export default class DoubleStraightRailPart extends RailPartBase<DoubleStraightRailPartProps, {}> {
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
    {pivotPartIndex: 1, pivot: Pivot.LEFT},
    {pivotPartIndex: 1, pivot: Pivot.RIGHT}
  ]

  angles = [
    () => this.props.angle,
    () => this.props.angle + 180,
    () => this.props.angle,
    () => this.props.angle + 180
  ]

  constructor(props: DoubleStraightRailPartProps) {
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
      length, position, pivotJointIndex, detectionEnabled, selected, fillColors, opacity,
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
        />
        <RectPart
          position={new Point(0, RailPartBase.RAIL_SPACE)}
          width={length}
          height={RAIL_PART_WIDTH}
          pivot={Pivot.LEFT}
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
