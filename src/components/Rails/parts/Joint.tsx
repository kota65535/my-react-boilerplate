import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import RectPart from "./primitives/RectPart";
import DetectablePart from "./primitives/DetectablePart";
import CirclePart from "./primitives/CirclePart";
import {RailPartInfo} from "components/Rails/parts/types";
import {Pivot} from "components/Rails/parts/primitives/PartBase";
import {JOINT_DETECTION_OPACITY_RATE, JOINT_FILL_COLORS} from "constants/parts";


interface Props extends Partial<DefaultProps> {
  name?: string
  data?: RailPartInfo
  onClick?: (e: MouseEvent) => void
}

interface DefaultProps {
  position?: Point
  angle?: number
  detectionEnabled?: boolean
  pivot?: Pivot
  selected?: boolean
  opacity?: number
  fillColors?: string[]
}

export type JointProps = Props & DefaultProps;


export default class Joint extends React.Component<JointProps, {}> {
  public static defaultProps: DefaultProps = {
    position: new Point(0, 0),
    angle: 0,
    pivot: Pivot.CENTER,
    detectionEnabled: true,
    selected: false,
    opacity: 1,
    fillColors: JOINT_FILL_COLORS
  }
  static WIDTH = 8;
  static HEIGHT = 18;
  static HIT_RADIUS = 20;
  static FLOW_COLOR_1 = "royalblue";
  static FLOW_COLOR_2 = "greenyellow";
  static ANIMATION_MAX = 30
  static ANIMATION_MIN = 60

  detectablePart: DetectablePart

  constructor(props: JointProps) {
    super(props)
  }

  // ========== Public APIs ==========

  get position() {
    return this.detectablePart.mainPart.path.position
  }

  move(position: Point): void {
    this.detectablePart.move(position)
  }

  // ========== Private methods ==========

  render() {
    const {position, angle, detectionEnabled, pivot, selected, fillColors, opacity,
      name, data, onClick} = this.props

    return (
      <DetectablePart
        mainPart={
          <RectPart
            position={position}
            angle={angle}
            width={Joint.WIDTH}
            height={Joint.HEIGHT}
            pivot={pivot}
            selected={selected}
            opacity={opacity}
          />
        }
        detectionPart={
          <CirclePart
            position={position}
            radius={Joint.HIT_RADIUS}
            selected={selected}
            opacity={opacity * JOINT_DETECTION_OPACITY_RATE}
          />
        }
        fillColors={fillColors}
        detectionEnabled={detectionEnabled}
        name={name}
        // data={Object.assign(data, {detectionState})}
        onClick={onClick}
        ref={(part) => this.detectablePart = part}
      />
    )
  }
}
