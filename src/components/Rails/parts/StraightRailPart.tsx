import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import RectPart, {AnchorPoint} from "./primitives/RectPart";
import DetectablePart, {DetectionState} from "./primitives/DetectablePart";
import {RAIL_PART_DETECTION_PART_OPACITY, RAIL_PART_FILL_COLORS, RAIL_PART_WIDTH} from "constants/tools";
import {RailPartInfo} from "components/Rails/parts/types";


export enum RailPartAnchor {
  START,
  END
}

const ANCHOR_TABLE = {
  [RailPartAnchor.START]: AnchorPoint.LEFT,
  [RailPartAnchor.END]: AnchorPoint.RIGHT
}


interface Props extends Partial<DefaultProps> {
  length: number
  name?: string
  data?: RailPartInfo
}

interface DefaultProps {
  position?: Point
  angle?: number
  detectionState?: DetectionState
  anchor?: RailPartAnchor
  selected?: boolean
  opacity?: number
  fillColors?: string[]
}

export type StraightRailPartProps = Props & DefaultProps;


export default class StraightRailPart extends React.Component<StraightRailPartProps, {}> {
  public static defaultProps: DefaultProps = {
    position: new Point(0, 0),
    angle: 0,
    anchor: RailPartAnchor.START,
    detectionState: DetectionState.DISABLED,
    selected: false,
    opacity: 1,
    fillColors: RAIL_PART_FILL_COLORS
  }

  static FLOW_COLOR_1 = "royalblue";
  static FLOW_COLOR_2 = "greenyellow";
  static ANIMATION_MAX = 30
  static ANIMATION_MIN = 60

  detectablePart: DetectablePart

  constructor (props: StraightRailPartProps) {
    super(props)
  }

  // ========== Public APIs ==========

  get startPoint() {
    return this.detectablePart.mainPart.getCenterOfLeft()
  }

  get endPoint() {
    return this.detectablePart.mainPart.getCenterOfRight()
  }

  // ========== Private methods ==========

  render() {
    const {position, angle, length, detectionState, anchor, selected, fillColors, opacity, name, data} = this.props
    return (
      <DetectablePart
        mainPart={
          <RectPart
            position={position}
            angle={angle}
            width={length}
            height={RAIL_PART_WIDTH}
            fillColor={'blue'}
            anchor={ANCHOR_TABLE[anchor]}
            selected={selected}
            name={name}
            data={data}
          />
        }
        detectionPart={
          <RectPart
            position={position}
            angle={angle}
            width={length}
            height={RAIL_PART_WIDTH + 4}
            fillColor={'blue'}
            anchor={ANCHOR_TABLE[anchor]}
            selected={selected}
            name={name}
            data={data}
          />
        }
        fillColors={fillColors}
        mainPartOpacity={opacity}
        detectionPartOpacity={RAIL_PART_DETECTION_PART_OPACITY}
        detectionState={detectionState}
        name={name}
        data={data}
        ref={(part) => this.detectablePart = part!}
      />
    )
  }
}
