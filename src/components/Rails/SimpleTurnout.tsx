import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import StraightRailPart from "./parts/StraightRailPart";
import CurveRailPart from "./parts/CurveRailPart";
import Joint from "./parts/Joint";
import {Pivot} from "components/Rails/parts/primitives/PartBase";
import {BaseItemData, ItemData} from "reducers/layout";
import {PaletteItem, RootState} from "store/type";
import {default as withHistory, WithHistoryProps} from "components/hoc/withHistory";
import {connect} from "react-redux";
import {compose} from "recompose";
import {setTemporaryItem} from "actions/builder";
import * as _ from "lodash";
import {ArcDirection} from "components/Rails/parts/primitives/ArcPart";
import {RailBase, RailBaseDefaultProps, RailBaseProps} from "components/Rails/RailBase";


interface SimpleTurnoutProps extends RailBaseProps {
  position: Point
  angle: number
  length: number
  radius: number
  centerAngle: number
  branchDirection: ArcDirection
  id: number
  selectedItem: PaletteItem
  temporaryItem: ItemData
  setTemporaryItem: (item: ItemData) => void
  activeLayerId: number
  name?: string
  layerId: number    // このアイテムが所属するレイヤー
}

// interface DefaultProps {
//   type?: string    // アイテムの種類、すなわちコンポーネントクラス。この文字列がReactElementのタグ名として用いられる
//   selected?: boolean
//   pivotJointIndex?: number
//   opacity?: number
//   hasOpposingJoints?: boolean[]
// }

export type SimpleTurnoutComposedProps = SimpleTurnoutProps & WithHistoryProps

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

export class SimpleTurnout extends RailBase<SimpleTurnoutComposedProps, {}> {
  public static NUM_RAIL_PARTS = 2
  public static NUM_JOINTS = 3

  public static defaultProps: RailBaseDefaultProps = {
    type: 'SimpleTurnout',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    hasOpposingJoints: new Array(SimpleTurnout.NUM_JOINTS).fill(false)
  }

  railParts: Array<any> = new Array(SimpleTurnout.NUM_RAIL_PARTS).fill(null)
  joints: Array<Joint> = new Array(SimpleTurnout.NUM_JOINTS).fill(null)

  constructor(props: SimpleTurnoutComposedProps) {
    super(props)

    // this.onJointClick = this.onJointClick.bind(this)
  }

  getJointPosition(jointId: number) {
    switch (jointId) {
      case 0:
        return this.railParts[0].startPoint
      case 1:
        return this.railParts[0].endPoint
      case 2:
        return this.railParts[1].endPoint
      default:
        throw Error(`Invalid joint ID ${jointId}`)
    }
  }

  getJointAngle(jointId: number) {
    switch (jointId) {
      case 0:
        return this.railParts[0].startAngle
      case 1:
        return this.railParts[0].endAngle
      case 2:
        return this.railParts[1].endAngle
      default:
        throw Error(`Invalid joint ID ${jointId}`)
    }
  }


  render() {
    const {position, length, angle, radius, centerAngle, branchDirection, id, selected, pivotJointIndex, opacity,
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
      <CurveRailPart
        radius={radius}
        centerAngle={centerAngle}
        direction={branchDirection}
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
        ref={(railPart) => this.railParts[1] = railPart}
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
        ref={(joint) => this.joints[1] = joint}
      />,
      <Joint
        angle={branchDirection === ArcDirection.RIGHT ? angle + centerAngle : angle - centerAngle}
        position={position}
        opacity={opacity}
        name={'Rail'}
        // anchor={AnchorPoint.RIGHT}   // ジョイントパーツの右端・左端をレールパーツに合わせる場合
        data={{
          railId: id,
          partType: 'Joint',
          partId: 2
        }}
        hasOpposingJoint={hasOpposingJoints[2]}
        ref={(joint) => this.joints[2] = joint}
      />
    ]
  }
}

export type SimpleTurnoutItemData = BaseItemData & SimpleTurnoutProps

export default connect(mapStateToProps, mapDispatchToProps)(compose<SimpleTurnoutProps, SimpleTurnoutProps>(
  withHistory
)(SimpleTurnout))
