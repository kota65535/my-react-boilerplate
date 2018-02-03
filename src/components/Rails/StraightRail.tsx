import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import StraightRailPart, {RailPartAnchor} from "./parts/StraightRailPart";
import {DetectionState} from "./parts/primitives/DetectablePart";
import Joint from "./parts/Joint";
import {BaseItemData} from "reducers/layout";


interface Props extends Partial<DefaultProps> {
  length: number
}

interface DefaultProps {
  position?: Point
  angle?: number
  selected?: boolean
  anchor?: RailPartAnchor
  detectionState?: DetectionState
}

export type StraightRailProps = Props & DefaultProps


export default class StraightRail extends React.Component<StraightRailProps, {}> {
  public static defaultProps: DefaultProps = {
    position: new Point(0, 0),
    angle: 0,
    selected: false,
    anchor: RailPartAnchor.START,
    detectionState: DetectionState.BEFORE_DETECT,
  }

  railPart: StraightRailPart
  joints: Array<Joint> = [null, null]

  constructor (props: StraightRailProps) {
    super(props)
  }


  componentDidUpdate() {
    this.fixJointsPosition()
  }

  componentDidMount() {
    this.fixJointsPosition()
  }

  // ジョイントの位置はレールパーツの位置が確定しないと合わせられないため、後から変更する
  fixJointsPosition() {
    switch (this.props.anchor) {
      case RailPartAnchor.START:
        this.joints[1]!.detectablePart.move(this.railPart.endPoint)
        break
      case RailPartAnchor.END:
        this.joints[0]!.detectablePart.move(this.railPart.startPoint)
        break
    }
  }

  render() {
    const {position, angle, length, selected, anchor} = this.props

    return [
      <StraightRailPart
        position={position}
        angle={angle}
        length={length}
        anchor={anchor}
        detectionState={DetectionState.BEFORE_DETECT}
        selected={selected}
        ref={(railPart) => this.railPart = railPart}
      />,
      <Joint
        angle={angle}
        position={position}
        ref={(joint) => this.joints[0] = joint}
      />,
      <Joint
        angle={angle}
        position={position}
        ref={(joint) => this.joints[1] = joint}
      />
    ]
  }
}

export type StraightRailItemData = BaseItemData & StraightRailProps