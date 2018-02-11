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
  onMouseMove?: (e: MouseEvent) => void
}

interface DefaultProps {
  position?: Point
  angle?: number
  pivot?: Pivot
  selected?: boolean
  opacity?: number
  fillColors?: string[]
  hasOpposingJoint: boolean
}

export type JointProps = Props & DefaultProps;


export default class Joint extends React.Component<JointProps, {}> {
  public static defaultProps: DefaultProps = {
    position: new Point(0, 0),
    angle: 0,
    pivot: Pivot.CENTER,
    selected: false,
    opacity: 1,
    fillColors: JOINT_FILL_COLORS,
    hasOpposingJoint: false
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

  // 対向ジョイントの接続が解除されたら状態をリセットする（再び検出可能にする）
  componentWillReceiveProps(nextProps: JointProps) {
    if (this.props.hasOpposingJoint && ! nextProps.hasOpposingJoint) {
      this.detectablePart.resetDetectionState()
    }
  }

  move(position: Point): void {
    this.detectablePart.move(position)
  }

  // ========== Private methods ==========

  render() {
    const {position, angle, hasOpposingJoint, pivot, selected, fillColors, opacity,
      name, data, onClick, onMouseMove} = this.props

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
        detectionEnabled={! hasOpposingJoint}
        name={name}
        // data={Object.assign(data, {detectionState})}
        onClick={onClick}
        onMouseMove={onMouseMove}
        ref={(part) => this.detectablePart = part}
      />
    )
  }
}
