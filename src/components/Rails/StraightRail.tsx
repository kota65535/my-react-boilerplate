import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import {BaseItemData} from "../hoc/withHistory";
import StraightRailPart, {RailPartAnchor} from "./parts/StraightRailPart";
import {DetectionState} from "./parts/primitives/DetectablePart";


interface Props extends Partial<DefaultProps> {
  length: number
}

interface DefaultProps {
  position: Point
  angle: number
  selected: boolean
  anchor: RailPartAnchor
  detectionState: DetectionState
}

export type StraightRailProps = Props & DefaultProps


const StraightRail = class extends React.Component<StraightRailProps, {}> {
  public static defaultProps: DefaultProps = {
    position: new Point(0, 0),
    angle: 0,
    selected: false,
    anchor: RailPartAnchor.START,
    detectionState: DetectionState.BEFORE_DETECT,
  }

  constructor (props: StraightRailProps) {
    super(props)
  }

  render() {
    const {position, angle, length, selected, anchor} = this.props
    return (
      <StraightRailPart
        position={position}
        angle={angle}
        length={length}
        anchor={anchor}
        detectionState={DetectionState.BEFORE_DETECT}
        selected={selected}
      />
    )
  }
} as React.ComponentClass<Props>

export default StraightRail


export type StraightRailItemData = BaseItemData & StraightRailProps
