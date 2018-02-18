import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import RectPart from "./Parts/RectPart";
import DetectablePart from "./Parts/DetectablePart";
import ArcPart, {ArcDirection} from "./Parts/ArcPart";
import {RAIL_PART_FILL_COLORS, RAIL_PART_WIDTH} from "constants/parts";
import {Pivot} from "components/Rails/RailParts/Parts/PartBase";
import {RailPartInfo} from "components/Rails/RailParts/types";
import getLogger from "logging";
import PartGroup from "components/Rails/RailParts/Parts/PartGroup";
import RailPartBase from "./RailPartBase";

const LOGGER = getLogger(__filename)


interface Props extends Partial<DefaultProps> {
  length: number
  name?: string
  data?: RailPartInfo
  onLeftClick?: (e: MouseEvent) => void
  onRightClick?: (e: MouseEvent) => void
  onFixed?: () => void
}

interface DefaultProps {
  position?: Point
  angle?: number
  pivotJointIndex?: number
  detectionEnabled?: boolean
  selected?: boolean
  opacity?: number
  fillColors?: string[]
}

export type DoubleCrossTurnoutRailPartProps = Props & DefaultProps;


export default class DoubleCrossTurnoutRailPart extends RailPartBase<DoubleCrossTurnoutRailPartProps, {}> {
  public static defaultProps: DefaultProps = {
    position: new Point(0, 0),
    angle: 0,
    pivotJointIndex: 0,
    detectionEnabled: false,
    selected: false,
    opacity: 1,
    fillColors: RAIL_PART_FILL_COLORS
  }

  detectablePart: DetectablePart

  pivots = [
    {pivotPartIndex: 0, pivot: Pivot.LEFT},
    {pivotPartIndex: 0, pivot: Pivot.RIGHT},
    {pivotPartIndex: 1, pivot: Pivot.LEFT},
    {pivotPartIndex: 1, pivot: Pivot.RIGHT}
  ]

  angles = [
    this.props.angle,
    this.props.angle + 180,
    this.props.angle,
    this.props.angle + 180
  ]

  constructor(props: DoubleCrossTurnoutRailPartProps) {
    super(props)
  }

  getPivot(jointIndex: number) {
    return this.pivots[jointIndex]
  }

  getAngle(jointIndex: number) {
    return this.angles[jointIndex]
  }

  render() {
    const {
      length, position, pivotJointIndex, detectionEnabled, selected, fillColors, opacity,
      name, data, onLeftClick, onRightClick, onFixed
    } = this.props

    // TODO: 方程式を解いてちゃんと値を出す
    const radius = length / (2 * Math.sin(15 / 180 * Math.PI))
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
        <ArcPart
          direction={ArcDirection.RIGHT}
          radius={radius}
          centerAngle={15}
          width={RAIL_PART_WIDTH}
          pivot={Pivot.LEFT}
        />
        <ArcPart
          position={new Point(length, 0)}
          direction={ArcDirection.RIGHT}
          angle={-15}
          radius={radius}
          centerAngle={15}
          width={RAIL_PART_WIDTH}
          pivot={Pivot.RIGHT}
        />
        <ArcPart
          position={new Point(0, RailPartBase.RAIL_SPACE)}
          direction={ArcDirection.LEFT}
          radius={radius}
          centerAngle={15}
          width={RAIL_PART_WIDTH}
          pivot={Pivot.LEFT}
        />
        <ArcPart
          position={new Point(length, RailPartBase.RAIL_SPACE)}
          direction={ArcDirection.LEFT}
          angle={15}
          radius={radius}
          centerAngle={15}
          width={RAIL_PART_WIDTH}
          pivot={Pivot.RIGHT}
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
