import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import RectPart, {AnchorPoint} from "./primitives/RectPart";
import DetectablePart, {DetectionState} from "./primitives/DetectablePart";
import CirclePart from "./primitives/CirclePart";


interface Props extends Partial<DefaultProps> {
}

interface DefaultProps {
  position?: Point
  angle?: number
  detectionState?: DetectionState
  anchor?: AnchorPoint
  selected?: boolean
}

export type JointProps = Props & DefaultProps;


export default class Joint extends React.Component<JointProps, {}> {
  public static defaultProps: DefaultProps = {
    position: new Point(0, 0),
    angle: 0,
    anchor: AnchorPoint.LEFT,
    detectionState: DetectionState.BEFORE_DETECT,
    selected: false
  }
  static WIDTH = 8;
  static HEIGHT = 18;
  static HIT_RADIUS = 20;
  static FLOW_COLOR_1 = "royalblue";
  static FLOW_COLOR_2 = "greenyellow";
  static ANIMATION_MAX = 30
  static ANIMATION_MIN = 60
  static FILL_COLORS = ['orange', 'deepskybule', 'black']
  static OPACITIES = [0.2, 0.2, 0]

  detectablePart: DetectablePart

  constructor (props: JointProps) {
    super(props)
  }

  // ========== Public APIs ==========

  move(position: Point): void {
    this.detectablePart.move(position)
  }

  render() {

    const {position, angle, detectionState, anchor, selected} = this.props
    return (
      <DetectablePart
        mainPart={
          <RectPart
            position={position}
            angle={angle}
            width={Joint.WIDTH}
            height={Joint.HEIGHT}
            anchor={anchor}
            selected={selected}
          />
        }
        detectionPart={
          <CirclePart
            position={position}
            radius={Joint.HIT_RADIUS}
            selected={selected}
          />
        }
        fillColors={Joint.FILL_COLORS}
        opacities={Joint.OPACITIES}
        detectionState={detectionState}
        ref={(part) => this.detectablePart = part!}
      />
    )
  }
}
