import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import {BaseItemData} from "../hoc/withHistory";
import CurveRailPart from "./parts/CurveRailPart";
import {DetectionState} from "./parts/primitives/DetectablePart";
import {RailPartAnchor} from "./parts/StraightRailPart";
import Joint from "./parts/Joint";


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

  railPart: CurveRailPart
  joints: Array<Joint> = [null, null]

  constructor (props: CurveRailProps) {
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
    const {radius, centerAngle, position, angle, selected, anchor} = this.props
    return [
      <CurveRailPart
        radius={radius}
        centerAngle={centerAngle}
        position={position}
        angle={angle}
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
        angle={angle + centerAngle}
        position={position}
        ref={(joint) => this.joints[1] = joint}
      />
    ]
  }
}


export type CurveRailItemData = BaseItemData & CurveRailProps
