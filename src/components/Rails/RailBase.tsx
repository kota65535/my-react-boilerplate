import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import Joint from "./RailParts/Joint";
import getLogger from "logging";
import {pointsEqual} from "components/Rails/utils";
import * as _ from "lodash";
import RailPartBase from "components/Rails/RailParts/RailPartBase";
import {RailComponents} from "components/Rails/index";
import * as update from "immutability-helper";
import RailFactory from "components/Rails/RailFactory";
import {ItemData} from "reducers/layout";
import {PaletteItem, RootState} from "store/type";
import {WithHistoryProps} from "components/hoc/withHistory";
import {setTemporaryItem} from "actions/builder";
import {TEMPORARY_RAIL_OPACITY} from "constants/tools";

const LOGGER = getLogger(__filename)


export interface RailBaseProps extends Partial<RailBaseDefaultProps> {
  position: Point
  angle: number
  id: number
  layerId: number    // このアイテムが所属するレイヤー
  name?: string
  onFixed?: (ref: any) => void

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
  enableJoints: boolean
}

export interface RailBaseState {
  jointPositions: Point[]
  jointAngles: number[]
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

export abstract class RailBase<P extends RailBaseComposedProps, S extends RailBaseState> extends React.Component<P, S> {

  public static defaultProps: RailBaseDefaultProps = {
    type: 'RailBase',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    hasOpposingJoints: [],
    enableJoints: true
  }

  railPart: RailPartBase<any, any>
  joints: Joint[]
  temporaryPivotJointIndex: number
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

  // TODO: これでOK?
  // shouldComponentUpdate() {
  //   return false
  // }
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
      // position: this.joints[jointId].position,
      position: this.railPart.getGlobalJointPosition(jointId),
      // angle: this.joints[jointId].angle,
      angle: this.railPart.getGlobalJointAngle(jointId),
      layerId: 1,
      opacity: TEMPORARY_RAIL_OPACITY,
      pivotJointIndex: this.temporaryPivotJointIndex,
      enableJoints: false
    })

  }
  /**
   * ジョイントからマウスが離れたら、仮レールを消す
   * @param {number} jointId
   * @param {MouseEvent} e
   */
  onJointMouseLeave = (jointId: number, e: MouseEvent) => {
    this.props.setTemporaryItem(null)
  }

  constructor(props: P) {
    super(props)
    // 本当はここに書きたいがエラーになる。Typescriptが糞
    // this.state = {
    //   railPartsFixed: false
    // }

  }

  componentDidUpdate() {
    this.setJointPositionsAndAngles()
  }

  componentDidMount() {
    this.setJointPositionsAndAngles()
  }

  createJointComponents() {
    const {id, opacity, hasOpposingJoints, enableJoints} = this.props
    const {jointPositions, jointAngles} = this.state

    return _.range(this.joints.length).map(i => {
      return (
        <Joint
          position={jointPositions[i]}
          angle={jointAngles[i]}
          opacity={opacity}
          name={'Rail'}
          data={{
            railId: id,
            partType: 'Joint',
            partId: i
          }}
          detectionEnabled={enableJoints}
          hasOpposingJoint={hasOpposingJoints[i]}
          onLeftClick={this.onJointLeftClick.bind(this, i)}
          onRightClick={this.onJointRightClick.bind(this, i)}
          onMouseMove={this.onJointMouseMove.bind(this, i)}
          onMouseEnter={this.onJointMouseEnter.bind(this, i)}
          onMouseLeave={this.onJointMouseLeave.bind(this, i)}
          ref={(joint) => this.joints[i] = joint}
        />
      )
    })
  }

  // レールパーツの位置・角度に合わせてジョイントの位置・角度を変更する
  private setJointPositionsAndAngles() {
    // 注意: オブジェクトをStateにセットする場合はきちんとCloneすること
    const jointPositions = _.range(this.joints.length).map(i => _.clone(this.railPart.getGlobalJointPosition(i)))
    const jointAngles = _.range(this.joints.length).map(i => _.clone(this.railPart.getGlobalJointAngle(i)))

    _.range(this.joints.length).forEach(i => {
      LOGGER.debug(`[Rail][${this.props.name}] Joint${i} position: ${this.state.jointPositions[i]} -> ${jointPositions[i]}`)
      LOGGER.debug(`[Rail][${this.props.name}] Joint${i} angle: ${this.state.jointAngles[i]} -> ${jointAngles[i]}`)
    })

    // レールパーツから取得したジョイントの位置・角度が現在のものと異なれば再描画
    if (_.range(this.joints.length).every(i =>
        pointsEqual(this.state.jointPositions[i], jointPositions[i])
        && this.state.jointAngles[i] === jointAngles[i])) {
      // noop
    } else {
      this.setState({
        jointPositions,
        jointAngles
      })
    }
  }
}
