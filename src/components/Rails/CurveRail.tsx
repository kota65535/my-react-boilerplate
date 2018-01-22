import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import {BaseItemData} from "../hoc/withHistory";
import CurveRailPart from "./parts/CurveRailPart";
import {DetectionState} from "./parts/primitives/DetectablePart";
import {RailPartAnchor} from "./parts/StraightRailPart";


interface Props extends Partial<DefaultProps> {
  radius: number
  centerAngle: number
}

interface DefaultProps {
  position?: Point
  angle?: number
  selected?: boolean
  anchor?: RailPartAnchor
  detectionState?: DetectionState
}

export type CurveRailProps = Props & DefaultProps


export default class CurveRail extends React.Component<CurveRailProps, {}> {
  public static defaultProps: DefaultProps = {
    position: new Point(0, 0),
    angle: 0,
    selected: false,
    anchor: RailPartAnchor.START,
    detectionState: DetectionState.BEFORE_DETECT,
  }

  constructor (props: CurveRailProps) {
    super(props)
  }

  render() {
    const {radius, centerAngle, position, angle, selected, anchor} = this.props
    return (
      <CurveRailPart
        radius={radius}
        centerAngle={centerAngle}
        position={position}
        angle={angle}
        anchor={anchor}
        detectionState={DetectionState.BEFORE_DETECT}
        selected={selected}
      />
    )
  }
}


export type CurveRailItemData = BaseItemData & CurveRailProps
