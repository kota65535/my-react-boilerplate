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
import * as update from "immutability-helper";
import {compose} from "recompose";
import {default as withHistory, WithHistoryProps} from "components/hoc/withHistory";


interface Props extends Partial<DefaultProps> {
  position: Point
  angle: number
  length: number
  id: number
  selectedItem: PaletteItem
  temporaryItem: ItemData
  setTemporaryItem: (item: ItemData) => void
  activeLayerId: number
  name?: string
  layerId: number    // このアイテムが所属するレイヤー
}

interface DefaultProps {
  type?: string    // アイテムの種類、すなわちコンポーネントクラス。この文字列がReactElementのタグ名として用いられる
  selected?: boolean
  pivotJointIndex?: number
  opacity?: number
  hasOpposingJoints?: boolean[]
}

export type StraightRailProps = Props & DefaultProps & WithHistoryProps


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

export class StraightRail extends React.Component<StraightRailProps, {}> {
  public static defaultProps: DefaultProps = {
    type: 'StraightRail',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    hasOpposingJoints: [false, false]
  }

  railPart: StraightRailPart
  joints: Array<Joint> = [null, null]

  constructor(props: StraightRailProps) {
    super(props)

    this.onJointClick = this.onJointClick.bind(this)
  }

  getJointPosition(jointId: number) {
    switch (jointId) {
      case 0:
        return this.railPart.startPoint
      case 1:
        return this.railPart.endPoint
      default:
        throw Error(`Invalid joint ID ${jointId}`)
    }
  }

  componentDidUpdate() {
    this.fixPositionByPivotJoint()
    this.fixJointsPosition()
  }

  componentDidMount() {
    this.fixPositionByPivotJoint()
    this.fixJointsPosition()
  }

  fixPositionByPivotJoint() {
    this.railPart.rotate(this.joints[0].angle - this.joints[this.props.pivotJointIndex].angle - this.props.angle, this.getJointPosition(this.props.pivotJointIndex))
    this.railPart.move(this.props.position, this.getJointPosition(this.props.pivotJointIndex))
  }

  // ジョイントの位置はレールパーツの位置が確定しないと合わせられないため、後から変更する
  fixJointsPosition() {
    this.joints.forEach((joint, i) => joint.move(this.getJointPosition(i)))
  }

  onJointClick = (jointId: number, e: any) => {
    switch (e.event.button) {
      case 0:
        this.onMouseLeftDown(jointId, e)
        break
      case 2:
        this.onMouseRightDown(jointId, e)
        break
    }
  }

  onMouseRightDown = (jointId: number, e: MouseEvent) => {

  }

  onMouseLeftDown = (jointId: number, e: MouseEvent) => {
    // パレットで選択したレール生成のためのPropsを取得
    const itemProps = RailFactory[this.props.selectedItem.name]()
    // 仮レールの位置にレールを設置
    this.props.addItem(this.props.activeLayerId, {
      ...itemProps,
      position: (this.props.temporaryItem as any).position,
      angle: (this.props.temporaryItem as any).angle,
      layerId: this.props.activeLayerId,
      hasOpposingJoints: [true, false]
    } as ItemData)

    // このレールのジョイントの接続状態を変更する
    this.props.updateItem(this.props as any, update(this.props, {
        hasOpposingJoints: {
          [jointId]: {$set: true}
        }
      }
    ), false)
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
    const {position, angle, length, id, selected, pivotJointIndex, opacity,
      hasOpposingJoints} = this.props

    return [
      <StraightRailPart
        position={position}
        angle={angle}
        length={length}
        pivot={Pivot.LEFT}
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
        angle={angle + 180}
        position={position}
        opacity={opacity}
        name={'Rail'}
        // anchor={AnchorPoint.LEFT}    // ジョイントパーツの右端・左端をレールパーツに合わせる場合
        data={{
          railId: id,
          partType: 'Joint',
          partId: 0
        }}
        hasOpposingJoint={hasOpposingJoints[0]}
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
        hasOpposingJoint={hasOpposingJoints[1]}
        onClick={this.onJointClick.bind(this, 1)}
        onMouseMove={this.onJointMouseMove.bind(this, 1)}
        ref={(joint) => this.joints[1] = joint}
      />
    ]
  }
}

export type StraightRailItemData = BaseItemData & StraightRailProps


export default connect(mapStateToProps, mapDispatchToProps)(compose<Props, Props>(
  withHistory
)(StraightRail))
