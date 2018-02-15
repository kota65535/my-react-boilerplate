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

enum BranchDirection {
  LEFT,
  RIGHT
}

interface Props extends Partial<DefaultProps> {
  position: Point
  angle: number
  length: number
  radius: number
  centerAngle: number
  // branchDirection: BranchDirection
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

export type SimpleTurnoutProps = Props & DefaultProps & WithHistoryProps

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

export class SimpleTurnout extends React.Component<SimpleTurnoutProps, {}> {
  public static defaultProps: DefaultProps = {
    type: 'SimpleTurnout',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    hasOpposingJoints: [false, false]
  }

  railPart: Array<any> = [null, null]
  joints: Array<Joint> = [null, null, null]

  constructor(props: SimpleTurnoutProps) {
    super(props)

    // this.onJointClick = this.onJointClick.bind(this)
  }

  getJointPosition(jointId: number) {
    switch (jointId) {
      case 0:
        return this.railPart[0].startPoint
      case 1:
        return this.railPart[0].endPoint
      case 2:
        return this.railPart[1].endPoint
      default:
        throw Error(`Invalid joint ID ${jointId}`)
    }
  }

  getJointAngle(jointId: number) {
    switch (jointId) {
      case 0:
        return this.railPart[0].startAngle
      case 1:
        return this.railPart[0].endAngle
      case 2:
        return this.railPart[1].endAngle
      default:
        throw Error(`Invalid joint ID ${jointId}`)
    }
  }

  componentDidUpdate() {
    this.fixRailPartPosition()
    this.fixJointsPosition()
  }

  componentDidMount() {
    this.fixRailPartPosition()
    this.fixJointsPosition()
  }

  // レールパーツの位置・角度をPivotJointの指定に合わせる
  fixRailPartPosition() {
    // console.log(this.joints[0].angle, this.getJointPosition(this.props.pivotJointIndex))
    const jointPosition = _.cloneDeep(this.getJointPosition(this.props.pivotJointIndex))
    // this.railPart.forEach(r => r.rotate(this.joints[0].props.angle - this.joints[this.props.pivotJointIndex].props.angle + this.props.angle, jointPosition))
    this.railPart[0].rotate(this.joints[0].props.angle - this.joints[this.props.pivotJointIndex].props.angle + this.railPart[0].props.angle, jointPosition)
    this.railPart[1].rotate(this.joints[0].props.angle - this.joints[this.props.pivotJointIndex].props.angle + this.railPart[1].props.angle, jointPosition)
    // // this.railPart.forEach(r => r.move(this.props.position, this.getJointPosition(this.props.pivotJointIndex)))
    // // this.railPart[0].move(this.props.position, jointPosition)
    this.railPart[0].move(this.props.position, jointPosition)
    this.railPart[1].move(this.props.position, jointPosition)
    // this.railPart.rotate(this.joints[0].angle, this.getJointPosition(this.props.pivotJointIndex))
    // this.railPart.rotate(this.joints[0].props.angle - this.joints[this.props.pivotJointIndex].props.angle + this.props.angle, this.getJointPosition(this.props.pivotJointIndex))
  }

  // ジョイントの位置はレールパーツの位置が確定しないと合わせられないため、後から変更する
  fixJointsPosition() {
    this.joints.forEach((joint, i) => joint.move(this.getJointPosition(i)))
    this.joints.forEach((joint, i) => joint.rotate(this.getJointAngle(i)))
  }

  render() {
    const {position, length, angle, radius, centerAngle, id, selected, pivotJointIndex, opacity,
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
        ref={(railPart) => this.railPart[0] = railPart}
      />,
      <CurveRailPart
        radius={radius}
        centerAngle={centerAngle}
        direction={ArcDirection.LEFT}
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
        ref={(railPart) => this.railPart[1] = railPart}
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
        angle={angle - centerAngle}
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
        ref={(joint) => this.joints[2] = joint}
      />
    ]
  }
}

export type SimpleTurnoutItemData = BaseItemData & SimpleTurnoutProps

export default connect(mapStateToProps, mapDispatchToProps)(compose<Props, Props>(
  withHistory
)(SimpleTurnout))
