import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import CurveRailPart from "./parts/CurveRailPart";
import Joint from "./parts/Joint";
import {Pivot} from "components/Rails/parts/primitives/PartBase";
import {BaseItemData} from "reducers/layout";


interface Props extends Partial<DefaultProps> {
  position: Point
  angle: number
  radius: number
  centerAngle: number
  id: number
}

interface DefaultProps {
  selected?: boolean
  pivot?: Pivot
  opacity?: number
}

export type CurveRailProps = Props & DefaultProps


export default class CurveRail extends React.Component<CurveRailProps, {}> {
  public static defaultProps: DefaultProps = {
    selected: false,
    pivot: Pivot.LEFT,
    opacity: 1,
  }

  railPart: CurveRailPart
  joints: Array<Joint> = [null, null]

  constructor(props: CurveRailProps) {
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
    switch (this.props.pivot) {
      case Pivot.LEFT:
        this.joints[1].detectablePart.move(this.railPart.endPoint)
        break
      case Pivot.RIGHT:
        this.joints[0].detectablePart.move(this.railPart.startPoint)
        break
    }
  }

  render() {
    const {position, angle, radius, centerAngle, id, selected, pivot, opacity} = this.props
    return [
      <CurveRailPart
        radius={radius}
        centerAngle={centerAngle}
        position={position}
        angle={angle}
        pivot={pivot}
        selected={selected}
        opacity={opacity}
        name={'Rail'}
        data={{
          railId: id,
          partType: 'RailPart',
          partId: 0
        }}
        ref={(railPart) => this.railPart = railPart}
      />,
      <Joint
        angle={angle}
        position={position}
        opacity={opacity}
        name={'Rail'}
        // anchor={AnchorPoint.LEFT}    // ジョイントパーツの右端・左端をレールパーツに合わせる場合
        data={{
          railId: id,
          partType: 'Joint',
          partId: 0
        }}
        hasOpposingJoint={true}
        ref={(joint) => this.joints[0] = joint}
      />,
      <Joint
        angle={angle + centerAngle}
        position={position}
        opacity={opacity}
        name={'Rail'}
        // anchor={AnchorPoint.RIGHT}   // ジョイントパーツの右端・左端をレールパーツに合わせる場合
        data={{
          railId: id,
          partType: 'Joint',
          partId: 1
        }}
        hasOpposingJoint={true}
        ref={(joint) => this.joints[1] = joint}
      />
    ]
  }
}

export type CurveRailItemData = BaseItemData & CurveRailProps