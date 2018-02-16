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
import {RailBase, RailBaseDefaultProps, RailBaseProps} from "components/Rails/RailBase";


export interface StraightRailProps extends RailBaseProps {
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


export type StraightRailComposedProps = StraightRailProps & WithHistoryProps


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

export class StraightRail extends RailBase<StraightRailComposedProps, {}> {

  public static NUM_RAIL_PARTS = 1
  public static NUM_JOINTS = 2

  public static defaultProps: RailBaseDefaultProps = {
    type: 'StraightRail',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    hasOpposingJoints: new Array(StraightRail.NUM_JOINTS).fill(false)
  }

  railParts: Array<any> = new Array(StraightRail.NUM_RAIL_PARTS).fill(null)
  joints: Array<Joint> = new Array(StraightRail.NUM_JOINTS).fill(null)

  constructor(props: StraightRailComposedProps) {
    super(props)

    this.onJointClick = this.onJointClick.bind(this)
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
    // FIXME
    this.props.setTemporaryItem(update(this.props.temporaryItem, {
        pivotJointIndex: {$set: 1}
      }
    ))

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
      layerId: 1,
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
        ref={(railPart) => this.railParts[0] = railPart}
      />,
      <Joint
        angle={angle + 180}
        position={position}
        opacity={opacity}
        name={'Rail'}
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


export default connect(mapStateToProps, mapDispatchToProps)(compose<StraightRailProps, StraightRailProps>(
  withHistory
)(StraightRail))
