import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import Joint from "./parts/Joint";
import {ItemData} from "reducers/layout";
import {PaletteItem, RootState} from "store/type";
import {WithHistoryProps} from "components/hoc/withHistory";
import {setTemporaryItem} from "actions/builder";
import * as _ from "lodash";
import {TEMPORARY_RAIL_OPACITY} from "constants/tools";
import RailFactory from "components/Rails/RailFactory";
import * as update from "immutability-helper";
import {RailComponents} from "components/Rails/index";
import getLogger from "logging";

const LOGGER = getLogger(__filename)


export interface RailBaseProps extends Partial<RailBaseDefaultProps> {
  position: Point
  angle: number
  id: number
  layerId: number    // このアイテムが所属するレイヤー
  name?: string

  selectedItem: PaletteItem
  temporaryItem: ItemData
  setTemporaryItem: (item: ItemData) => void
  activeLayerId: number
}

export interface RailBaseDefaultProps {
  type?: string    // アイテムの種類、すなわちコンポーネントクラス。この文字列がReactElementのタグ名として用いられる
  selected?: boolean
  pivotJointIndex?: number
  opacity?: number
  hasOpposingJoints?: boolean[]
}

type RailBaseComposedProps = RailBaseProps & WithHistoryProps

export const mapStateToProps = (state: RootState) => {
  return {
    selectedItem: state.builder.selectedItem,
    temporaryItem: state.builder.temporaryItem,
    activeLayerId: state.builder.activeLayerId
  }
}

export const mapDispatchToProps = (dispatch: any) => {
  return {
    setTemporaryItem: (item: ItemData) => dispatch(setTemporaryItem(item)),
  }
}

export abstract class RailBase<P extends RailBaseComposedProps, S> extends React.PureComponent<P, S> {

  public static defaultProps: RailBaseDefaultProps = {
    type: 'RailBase',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    hasOpposingJoints: []
  }

  public static RAIL_SPACE = 38

  railParts: any[]
  joints: Joint[]
  temporaryPivotJointIndex: number

  constructor(props: P) {
    super(props)
  }

  // TODO: これでOK?
  // shouldComponentUpdate() {
  //   return false
  // }

  getJointPosition(jointId: number) {
    switch (jointId) {
      case 0:
        return this.railParts[0].startPoint
      case 1:
        return this.railParts[0].endPoint
      default:
        // throw Error(`Invalid joint ID ${jointId}`)
    }
  }

  getJointAngle(jointId: number) {
    switch (jointId) {
      case 0:
        return this.railParts[0].startAngle - 180
      case 1:
        return this.railParts[0].endAngle
      default:
        // throw Error(`Invalid joint ID ${jointId}`)
    }
  }

  componentDidUpdate() {
    LOGGER.debug('updated')
    this.fixRailPartPosition()
    this.fixJointsPosition()
  }

  componentDidMount() {
    LOGGER.debug('mounted')
    this.fixRailPartPosition()
    this.fixJointsPosition()
  }

  /**
   * ジョイントを右クリックしたら、仮レールが接続するジョイントを変更する
   * @param {number} jointId
   * @param {MouseEvent} e
   */
  onJointRightClick = (jointId: number, e: MouseEvent) => {
    // 仮レールのPivotJointをインクリメントする
    const numJoints = RailComponents[this.props.temporaryItem.type].NUM_JOINTS
    const stride = RailComponents[this.props.temporaryItem.type].PIVOT_JOINT_CHANGING_STRIDE
    this.temporaryPivotJointIndex = (this.temporaryPivotJointIndex + stride) % numJoints
    this.props.setTemporaryItem(update(this.props.temporaryItem, {
        pivotJointIndex: {$set: this.temporaryPivotJointIndex}
      }
    ))
  }

  /**
   * ジョイントを左クリックしたら、仮レールの位置にレールを設置する
   * @param {number} jointId
   * @param {MouseEvent} e
   */
  onJointLeftClick = (jointId: number, e: MouseEvent) => {
    // パレットで選択したレール生成のためのPropsを取得
    const itemProps = RailFactory[this.props.selectedItem.name]()
    // PivotJointだけ接続状態にする
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

    // 仮レールに接続しているジョイントを接続状態にする
    this.props.updateItem(this.props as any, update(this.props, {
        hasOpposingJoints: {
          [jointId]: {$set: true}
        }
      }
    ), false)
    // 仮レールを消去する
    this.props.setTemporaryItem(null)
  }

  onJointMouseMove = (jointId: number, e: MouseEvent) => {
  }

  /**
   * ジョイントにマウスが乗ったら、仮レールを表示する
   * @param {number} jointId
   * @param {MouseEvent} e
   */
  onJointMouseEnter = (jointId: number, e: MouseEvent) => {
    // パレットで選択したレール生成のためのPropsを取得
    const itemProps = RailFactory[this.props.selectedItem.name]()
    // 仮レールを設置する
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

  onJointMouseLeave = (jointId: number, e: MouseEvent) => {
    this.props.setTemporaryItem(null)
  }


  // レールパーツの位置・角度をPivotJointの指定に合わせる
  fixRailPartPosition() {
    // console.log(this.joints[0].angle, this.getJointPosition(this.props.pivotJointIndex))
    const jointPosition = _.cloneDeep(this.getJointPosition(this.props.pivotJointIndex))
    this.railParts.forEach(r => r.rotate(
      this.joints[0].props.angle - this.joints[this.props.pivotJointIndex as number].props.angle + r.props.angle, jointPosition))
    // this.railParts.forEach(r => r.move(
    //   this.props.position, jointPosition))
  }

  // ジョイントの位置はレールパーツの位置が確定しないと合わせられないため、後から変更する
  fixJointsPosition() {
    // this.joints.forEach((joint, i) => joint.move(this.getJointPosition(i)))
    // this.joints.forEach((joint, i) => joint.rotate(this.getJointAngle(i)))
  }
}
