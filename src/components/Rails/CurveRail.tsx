import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import CurveRailPart from "./parts/CurveRailPart";
import Joint from "./parts/Joint";
import {Pivot} from "components/Rails/parts/primitives/PartBase";
import {BaseItemData, ItemData} from "reducers/layout";
import {PaletteItem, RootState} from "store/type";
import {default as withHistory, WithHistoryProps} from "components/hoc/withHistory";
import {connect} from "react-redux";
import {compose} from "recompose";
import {setTemporaryItem} from "actions/builder";
import {ArcDirection} from "components/Rails/parts/primitives/ArcPart";
import {RailBase, RailBaseDefaultProps, RailBaseProps} from "components/Rails/RailBase";
import {TEMPORARY_RAIL_OPACITY} from "constants/tools";
import RailFactory from "components/Rails/RailFactory";
import * as update from "immutability-helper";


export interface CurveRailProps extends RailBaseProps {
  radius: number
  centerAngle: number
  selectedItem: PaletteItem
  temporaryItem: ItemData
  setTemporaryItem: (item: ItemData) => void
  activeLayerId: number
  name?: string
}

export type CurveRailComposedProps = CurveRailProps & WithHistoryProps

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

export class CurveRail extends RailBase<CurveRailComposedProps, {}> {

  public static NUM_RAIL_PARTS = 1
  public static NUM_JOINTS = 2

  public static defaultProps: RailBaseDefaultProps = {
    type: 'CurveRail',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    hasOpposingJoints: new Array(CurveRail.NUM_JOINTS).fill(false)
  }

  railParts: Array<any> = new Array(CurveRail.NUM_RAIL_PARTS).fill(null)
  joints: Array<Joint> = new Array(CurveRail.NUM_JOINTS).fill(null)

  constructor(props: CurveRailComposedProps) {
    super(props)

    this.onJointLeftClick = this.onJointLeftClick.bind(this)
    this.onJointRightClick = this.onJointRightClick.bind(this)
  }


  onJointRightClick = (jointId: number, e: MouseEvent) => {
    this.temporaryPivotJointIndex = (this.temporaryPivotJointIndex + 1) % this.joints.length
    this.props.setTemporaryItem(update(this.props.temporaryItem, {
        pivotJointIndex: {$set: this.temporaryPivotJointIndex}
      }
    ))
  }

  onJointLeftClick = (jointId: number, e: MouseEvent) => {
    // パレットで選択したレール生成のためのPropsを取得
    const itemProps = RailFactory[this.props.selectedItem.name]()
    let hasOpposingJoints = new Array(this.props.hasOpposingJoints.length).fill(false)
    hasOpposingJoints[this.temporaryPivotJointIndex] = true

    // 仮レールの位置にレールを設置
    this.props.addItem(this.props.activeLayerId, {
      ...itemProps,
      position: (this.props.temporaryItem as any).position,
      angle: (this.props.temporaryItem as any).angle,
      layerId: this.props.activeLayerId,
      hasOpposingJoints: hasOpposingJoints,
      pivotJointIndex: this.temporaryPivotJointIndex
    } as ItemData)

    // このレールのジョイントの接続状態を変更する
    this.props.updateItem(this.props as any, update(this.props, {
        hasOpposingJoints: {
          [jointId]: {$set: true}
        }
      }
    ), false)
    this.props.setTemporaryItem(null)
  }

  onJointMouseMove = (jointId: number, e: MouseEvent) => {
    // 仮レールを設置する
    const itemProps = RailFactory[this.props.selectedItem.name]()
    this.props.setTemporaryItem({
      ...itemProps,
      id: -1,
      name: 'TemporaryRail',
      position: this.joints[jointId].position,
      angle: this.joints[jointId].angle,
      layerId: 1,
      opacity: TEMPORARY_RAIL_OPACITY,
      pivotJointIndex: this.temporaryPivotJointIndex
    })
  }

  render() {
    const {position, angle, radius, centerAngle, id, selected, pivotJointIndex, opacity,
      hasOpposingJoints} = this.props
    return [
      <CurveRailPart
        radius={radius}
        centerAngle={centerAngle}
        direction={ArcDirection.RIGHT}
        position={position}
        angle={angle}
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
        onLeftClick={this.onJointLeftClick.bind(this,  0)}
        onRightClick={this.onJointRightClick.bind(this,  0)}
        onMouseMove={this.onJointMouseMove.bind(this, 0)}
        ref={(joint) => this.joints[0] = joint}
      />,
      <Joint
        angle={angle + centerAngle}
        position={position}
        opacity={opacity}
        name={'Rail'}
        data={{
          railId: id,
          partType: 'Joint',
          partId: 1
        }}
        hasOpposingJoint={hasOpposingJoints[1]}
        onLeftClick={this.onJointLeftClick.bind(this, 1)}
        onRightClick={this.onJointRightClick.bind(this,  1)}
        onMouseMove={this.onJointMouseMove.bind(this, 1)}
        ref={(joint) => this.joints[1] = joint}
      />
    ]
  }
}

export type CurveRailItemData = BaseItemData & CurveRailProps

export default connect(mapStateToProps, mapDispatchToProps)(compose<CurveRailProps, CurveRailProps>(
  withHistory
)(CurveRail))
