import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import RectPart, {AnchorPoint} from "./primitives/RectPart";
import DetectablePart, {DetectionState} from "./primitives/DetectablePart";


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
}

interface DefaultProps {
  position?: Point
  angle?: number
  detectionState?: DetectionState
  anchor?: RailPartAnchor
  selected?: boolean
}

export type StraightRailPartProps = Props & DefaultProps;


export default class StraightRailPart extends React.Component<StraightRailPartProps, {}> {
  public static defaultProps: DefaultProps = {
    position: new Point(0, 0),
    angle: 0,
    anchor: RailPartAnchor.START,
    detectionState: DetectionState.BEFORE_DETECT,
    selected: false
  }

  static HEIGHT = 14;
  static MARGIN = 3;
  static FLOW_COLOR_1 = "royalblue";
  static FLOW_COLOR_2 = "greenyellow";
  static ANIMATION_MAX = 30
  static ANIMATION_MIN = 60
  static FILL_COLORS = [ 'black', 'deepskybule', 'black']
  static OPACITIES = [0.2, 0.2, 0]

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
    const {position, angle, length, detectionState, anchor, selected} = this.props
    return (
      <DetectablePart
        mainPart={
          <RectPart
            position={position}
            angle={angle}
            width={length}
            height={StraightRailPart.HEIGHT}
            fillColor={'blue'}
            anchor={ANCHOR_TABLE[anchor]}
            selected={selected}
          />
        }
        detectionPart={
          <RectPart
            position={position}
            angle={angle}
            width={length}
            height={StraightRailPart.HEIGHT + 4}
            fillColor={'blue'}
            anchor={ANCHOR_TABLE[anchor]}
            selected={selected}
          />
        }
        fillColors={StraightRailPart.FILL_COLORS}
        opacities={StraightRailPart.OPACITIES}
        detectionState={detectionState}
        name={name}
        ref={(part) => this.detectablePart = part!}
      />
    )
  }
}
