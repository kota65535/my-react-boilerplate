import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import StraightRailPart from "./parts/StraightRailPart";
import Joint from "./parts/Joint";
import {Pivot} from "components/Rails/parts/primitives/PartBase";
import {BaseItemData, ItemData} from "reducers/layout";
import {PaletteItem, RootState} from "store/type";
import {setTemporaryItem} from "actions/builder";
import {connect} from "react-redux";
import RailFactory from "components/Rails/RailFactory";
import {TEMPORARY_RAIL_OPACITY} from "constants/tools";


interface Props extends Partial<DefaultProps> {
  position: Point
  addItem: (layerId: number, item: ItemData) => void
  angle: number
  length: number
  id: number
  selectedItem: PaletteItem
  temporaryItem: ItemData
  setTemporaryItem: (item: ItemData) => void
  activeLayerId: number
  detectionEnabled: boolean[]
}

interface DefaultProps {
  selected?: boolean
  pivot?: Pivot
  opacity?: number
  detectionEnabled?: boolean[]
}

interface State {
  jointDetectionStates: boolean[]
}

export type StraightRailProps = Props & DefaultProps


const mapStateToProps = (state: RootState) => {
  return {
    selectedItem: state.builder.selectedItem,
    temporaryItem: state.builder.temporaryItem,
    activeLayerId: state.builder.activeLayerId
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    setTemporaryItem: (item: ItemData) => dispatch(setTemporaryItem(item)),
  }
}

export class StraightRail extends React.Component<StraightRailProps, State> {
  public static defaultProps: DefaultProps = {
    selected: false,
    pivot: Pivot.LEFT,
    opacity: 1,
    detectionEnabled: [false, false]
  }

  railPart: StraightRailPart
  joints: Array<Joint> = [null, null]

  constructor(props: StraightRailProps) {
    super(props)
    this.state = {
      jointDetectionStates: [false, false]
    }

    this.onJointClick = this.onJointClick.bind(this)
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

  onJointClick = (jointId: number, e: MouseEvent) => {
    // パレットで選択したレール生成のためのPropsを取得
    const itemProps = RailFactory[this.props.selectedItem.name]()
    // 仮レールの位置にレールを設置
    this.props.addItem(this.props.activeLayerId, {
      ...itemProps,
      position: (this.props.temporaryItem as any).position,
      angle: (this.props.temporaryItem as any).angle,
      layerId: this.props.activeLayerId,
      detectionEnabled: [false, true]
    } as ItemData)
  }

  onJointMouseMove = (jointId: number, e: MouseEvent) => {
    // 仮レールを設置する
    const itemProps = RailFactory[this.props.selectedItem.name]()
    this.props.setTemporaryItem({
      ...itemProps,
      id: -1,
      name: 'TemporaryRail',
      position: this.joints[jointId].position,
      angle: this.joints[jointId].props.angle,
      opacity: TEMPORARY_RAIL_OPACITY,
    })
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
        detectionEnabled={this.props.detectionEnabled[0]}
        onClick={this.onJointClick.bind(this,  0)}
        onMouseMove={this.onJointMouseMove.bind(this, 0)}
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
        detectionEnabled={this.props.detectionEnabled[1]}
        onClick={this.onJointClick.bind(this, 1)}
        onMouseMove={this.onJointMouseMove.bind(this, 1)}
        ref={(joint) => this.joints[1] = joint}
      />
    ]
  }
}

export type StraightRailItemData = BaseItemData & StraightRailProps


export default connect(mapStateToProps, mapDispatchToProps)(StraightRail)
