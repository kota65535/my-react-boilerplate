import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import DetectablePart from "./primitives/DetectablePart";
import CirclePart from "./primitives/CirclePart";
import {RailPartInfo} from "components/Rails/parts/types";
import {Pivot} from "components/Rails/parts/primitives/PartBase";
import {JOINT_DETECTION_OPACITY_RATE, JOINT_FILL_COLORS} from "constants/parts";
import TrianglePart from "components/Rails/parts/primitives/TrianglePart";
import getLogger from "logging";

const LOGGER = getLogger(__filename)

interface Props extends Partial<DefaultProps> {
  name?: string
  data?: RailPartInfo
  onMouseMove?: (e: MouseEvent) => void
  onLeftClick?: (e: MouseEvent) => void
  onRightClick?: (e: MouseEvent) => void
  onMouseEnter?: (e: MouseEvent) => void
  onMouseLeave?: (e: MouseEvent) => void
}

interface DefaultProps {
  position?: Point
  angle?: number
  pivot?: Pivot
  selected?: boolean
  opacity?: number
  fillColors?: string[]
  hasOpposingJoint?: boolean
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
  static HIT_RADIUS = 16;
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
    return this.detectablePart.position
  }

  get angle() {
    return this.detectablePart.angle
  }

  // 対向ジョイントの接続が解除されたら状態をリセットする（再び検出可能にする）
  componentWillReceiveProps(nextProps: JointProps) {
    if (this.props.hasOpposingJoint && ! nextProps.hasOpposingJoint) {
      this.detectablePart.resetDetectionState()
    }
  }

  move(position: Point): void {
    LOGGER.debug(`move ${this.detectablePart.position} ->  ${position}`)
    this.detectablePart.move(position)
  }

  rotateRelatively(difference: number, pivot: Point = this.position) {
    this.detectablePart.rotateRelatively(difference, pivot);
  }

  rotate(angle: number, pivot: Point = this.position) {
    LOGGER.debug(`rotate ${this.detectablePart.angle} ->  ${angle} @ ${pivot}`)
    this.detectablePart.rotate(angle, pivot);
  }

  // ========== Private methods ==========

  render() {
    const {position, angle, hasOpposingJoint, pivot, selected, fillColors, opacity,
      name, data, onLeftClick, onRightClick, onMouseMove, onMouseEnter, onMouseLeave} = this.props

    return (
      <DetectablePart
        mainPart={
          <TrianglePart
            width={Joint.WIDTH}
            height={Joint.HEIGHT}
            opacity={opacity}
          />
        }
        detectionPart={
          <CirclePart
            radius={Joint.HIT_RADIUS}
            opacity={opacity * JOINT_DETECTION_OPACITY_RATE}
          />
        }
        position={position}
        angle={angle}
        pivot={pivot}
        fillColors={fillColors}
        detectionEnabled={! hasOpposingJoint}
        name={name}
        // data={Object.assign(data, {detectionState})}
        onLeftClick={onLeftClick}
        onRightClick={onRightClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        ref={(part) => this.detectablePart = part}
      />
    )
  }
}
