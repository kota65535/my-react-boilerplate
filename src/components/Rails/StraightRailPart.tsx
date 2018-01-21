import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import {BaseItemData} from "../hoc/withHistory";
import RectPart, {AnchorPoint} from "./parts/primitives/RectPart";
import DetectablePart, {DetectionState} from "./parts/primitives/DetectablePart";


export enum RailPartAnchor {
  START,
  END
}

const ANCHOR_TABLE = {
  [RailPartAnchor.START]: AnchorPoint.LEFT,
  [RailPartAnchor.END]: AnchorPoint.RIGHT
}


export interface StraightRailProps {
  position: Point
  angle: number
  length: number
  detectionState: DetectionState
  anchor: RailPartAnchor
}

export default class StraightRailPart extends React.Component<StraightRailProps, {}> {
  static HEIGHT = 14;
  static MARGIN = 3;
  static FLOW_COLOR_1 = "royalblue";
  static FLOW_COLOR_2 = "greenyellow";
  static ANIMATION_MAX = 30
  static ANIMATION_MIN = 60
  static FILL_COLORS = [ 'black', 'deepskybule', 'black']
  static OPACITIES = [0.2, 0.2, 0]

  constructor (props: StraightRailProps) {
    super(props)
  }

  render() {

    const {position, angle, length, detectionState, anchor} = this.props


    return (
      <DetectablePart
        position={position}
        angle={angle}
        width={length}
        height={StraightRailPart.HEIGHT}
        widthMargin={0}
        heightMargin={StraightRailPart.MARGIN}
        fillColors={StraightRailPart.FILL_COLORS}
        opacities={StraightRailPart.OPACITIES}
        detectionState={detectionState}
        anchor={ANCHOR_TABLE[anchor]}
      />)
  }
}

export type StraightRailItemData = BaseItemData & StraightRailProps
