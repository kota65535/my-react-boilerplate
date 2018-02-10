import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import StraightRailPart from "./parts/StraightRailPart";
import Joint from "./parts/Joint";
import {Pivot} from "components/Rails/parts/primitives/PartBase";
import {BaseItemData} from "reducers/layout";


interface Props extends Partial<DefaultProps> {
  position: Point
  angle: number
  length: number
  id: number
}

interface DefaultProps {
  selected?: boolean
  pivot?: Pivot
  opacity?: number
}

export type StraightRailProps = Props & DefaultProps


export default class StraightRail extends React.Component<StraightRailProps, {}> {
  public static defaultProps: DefaultProps = {
    selected: false,
    pivot: Pivot.LEFT,
    opacity: 1,
  }

  railPart: StraightRailPart
  joints: Array<Joint> = [null, null]

  constructor(props: StraightRailProps) {
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
        // ジョイントパーツの右端・左端をレールパーツに合わせる場合
        // this.joints[1].detectablePart.move(this.railPart.endPoint, this.joints[1].detectablePart.mainPart.getCenterOfRight())
        this.joints[1].detectablePart.move(this.railPart.endPoint)
        break
      case Pivot.RIGHT:
        this.joints[0].detectablePart.move(this.railPart.startPoint)
        break
    }
  }

  onJointClick = (e: MouseEvent) => {

  }



  render() {
    const {position, angle, length, id, selected, pivot, opacity} = this.props

    return [
      <StraightRailPart
        position={position}
        angle={angle}
        length={length}
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
        angle={angle - 180}
        position={position}
        opacity={opacity}
        name={'Rail'}
        // anchor={AnchorPoint.LEFT}    // ジョイントパーツの右端・左端をレールパーツに合わせる場合
        data={{
          railId: id,
          partType: 'Joint',
          partId: 0
        }}
        ref={(joint) => this.joints[0] = joint}
      />,
      <Joint
        angle={angle}
        position={position}
        opacity={opacity}
        name={'Rail'}
        // anchor={AnchorPoint.RIGHT}   // ジョイントパーツの右端・左端をレールパーツに合わせる場合
        data={{
          railId: id,
          partType: 'Joint',
          partId: 1
        }}
        onClick={this.onJointClick}
        ref={(joint) => this.joints[1] = joint}
      />
    ]
  }
}

export type StraightRailItemData = BaseItemData & StraightRailProps