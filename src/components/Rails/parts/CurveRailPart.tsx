import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import RectPart, {AnchorPoint} from "./primitives/RectPart";
import DetectablePart, {DetectionState} from "./primitives/DetectablePart";
import {RailPartAnchor, default as StraightRailPart} from "./StraightRailPart";
import ArcPart from "./primitives/ArcPart";


const ANCHOR_TABLE = {
  [RailPartAnchor.START]: AnchorPoint.LEFT,
  [RailPartAnchor.END]: AnchorPoint.RIGHT
}


interface Props extends Partial<DefaultProps> {
  radius: number
  centerAngle: number
  name?: string
}

interface DefaultProps {
  position?: Point
  angle?: number
  detectionState?: DetectionState
  anchor?: RailPartAnchor
  selected?: boolean
}

export type CurveRailPartProps = Props & DefaultProps;


export default class CurveRailPart extends React.Component<CurveRailPartProps, {}> {
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

  constructor (props: CurveRailPartProps) {
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

    const {radius, centerAngle, position, angle, detectionState, anchor, selected, name} = this.props
    return (
      <DetectablePart
        mainPart={
          <ArcPart
            radius={radius}
            centerAngle={centerAngle}
            position={position}
            angle={angle}
            width={StraightRailPart.HEIGHT}
            fillColor={'blue'}
            anchor={ANCHOR_TABLE[anchor]}
            selected={selected}
          />
        }
        detectionPart={
          <ArcPart
            radius={radius}
            centerAngle={centerAngle}
            position={position}
            angle={angle}
            width={StraightRailPart.HEIGHT}
            fillColor={'blue'}
            anchor={ANCHOR_TABLE[anchor]}
            selected={selected}
          />
        }
        fillColors={CurveRailPart.FILL_COLORS}
        opacities={CurveRailPart.OPACITIES}
        detectionState={detectionState}
        name={name}
        ref={(part) => this.detectablePart = part}
      />
    )
  }
}
