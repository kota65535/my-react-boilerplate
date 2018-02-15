import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import RectPart from "./primitives/RectPart";
import DetectablePart from "./primitives/DetectablePart";
import {RAIL_PART_DETECTION_OPACITY_RATE, RAIL_PART_FILL_COLORS, RAIL_PART_WIDTH} from "constants/parts";
import {RailPartInfo} from "components/Rails/parts/types";
import {Pivot} from "components/Rails/parts/primitives/PartBase";


interface Props extends Partial<DefaultProps> {
  length: number
  name?: string
  data?: RailPartInfo
  onClick?: (e: MouseEvent) => void
}

interface DefaultProps {
  position?: Point
  angle?: number
  pivot?: Pivot
  detectionEnabled?: boolean
  selected?: boolean
  opacity?: number
  fillColors?: string[]
}

export type StraightRailPartProps = Props & DefaultProps;


export default class StraightRailPart extends React.Component<StraightRailPartProps, {}> {
  public static defaultProps: DefaultProps = {
    position: new Point(0, 0),
    angle: 0,
    detectionEnabled: false,
    pivot: Pivot.LEFT,
    selected: false,
    opacity: 1,
    fillColors: RAIL_PART_FILL_COLORS
  }

  detectablePart: DetectablePart

  constructor(props: StraightRailPartProps) {
    super(props)
  }

  // ========== Public APIs ==========

  get startPoint() {
    return (this.detectablePart.mainPart as RectPart).getCenterOfLeft()
  }

  get endPoint() {
    return (this.detectablePart.mainPart as RectPart).getCenterOfRight()
  }

  get startAngle() {
    return this.detectablePart.angle
  }

  get endAngle() {
    return this.detectablePart.angle
  }

  moveRelatively(difference: Point) {
    this.detectablePart.moveRelatively(difference)
  }

  move(position: Point, pivot: Point = this.startPoint): void {
    this.detectablePart.move(position, pivot)
  }

  rotateRelatively(difference: number, pivot: Point = this.startPoint) {
    this.detectablePart.rotateRelatively(difference, pivot);
  }

  rotate(angle: number, pivot: Point = this.startPoint) {
    this.detectablePart.rotate(angle, pivot);
  }

  // ========== Private methods ==========

  render() {
    const {length, position, angle, pivot, detectionEnabled, selected, fillColors, opacity,
      name, data , onClick} = this.props
    return (
      <DetectablePart
        mainPart={
          <RectPart
            position={position}
            angle={angle}
            width={length}
            height={RAIL_PART_WIDTH}
            pivot={pivot}
            selected={selected}
          />
        }
        detectionPart={
          <RectPart
            position={position}
            angle={angle}
            width={length}
            height={RAIL_PART_WIDTH}
            pivot={pivot}
            selected={selected}
            opacity={opacity * RAIL_PART_DETECTION_OPACITY_RATE}
          />
        }
        fillColors={fillColors}
        detectionEnabled={detectionEnabled}
        name={name}
        data={data}
        onClick={onClick}
        ref={(part) => this.detectablePart = part}
      />
    )
  }
}
