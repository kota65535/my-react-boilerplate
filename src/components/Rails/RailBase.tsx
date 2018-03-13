import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import Joint from "./RailParts/Joint";
import getLogger from "logging";
import {pointsEqual} from "components/Rails/utils";
import * as _ from "lodash";
import RailPartBase from "components/Rails/RailParts/RailPartBase";
import {RailComponentClasses} from "components/Rails/index";
import update from "immutability-helper";
import RailFactory from "components/Rails/RailFactory";
import {JointInfo, RailData} from "reducers/layout";
import {PaletteItem, RootState} from "store/type";
import {setTemporaryItem} from "actions/builder";
import {TEMPORARY_RAIL_OPACITY} from "constants/tools";
import {JointPair, WithBuilderPublicProps} from "components/hoc/withBuilder";
import Combinatorics from "js-combinatorics"
import {DetectionState} from "components/Rails/RailParts/Parts/DetectablePart";
import {addRail} from "actions/layout";
import {nextRailId} from "selectors";

const LOGGER = getLogger(__filename)


export interface RailBaseProps extends RailBaseDefaultProps {
  position: Point
  angle: number
  id: number
  layerId: number    // このアイテムが所属するレイヤー
  name?: string
  onFixed?: (ref: any) => void
  refInstance?: any

  selectedItem: PaletteItem
  temporaryItem: RailData
  activeLayerId: number
  nextRailId: number

  setTemporaryItem: (item: RailData) => void
  addRail: (item: RailData, overwrite?: boolean) => void
}

export interface RailBaseDefaultProps {
  type: string    // アイテムの種類、すなわちコンポーネントクラス。この文字列がReactElementのタグ名として用いられる
  selected: boolean
  pivotJointIndex: number
  opacity: number
  opposingJoints: JointInfo[]
  enableJoints: boolean
}

export interface RailBaseState {
  jointPositions: Point[]
  jointAngles: number[]
}

type RailBaseComposedProps = RailBaseProps & WithBuilderPublicProps

export const mapStateToProps = (state: RootState) => {
  return {
    selectedItem: state.builder.selectedItem,
    temporaryItem: state.builder.temporaryItem,
    activeLayerId: state.builder.activeLayerId,
    nextRailId: nextRailId(state)
  }
}

export const mapDispatchToProps = (dispatch: any) => {
  return {
    setTemporaryItem: (item: RailData) => dispatch(setTemporaryItem(item)),
    addRail: (item: RailData, overwrite = false) => dispatch(addRail({item, overwrite})),
  }
}

export abstract class RailBase<P extends RailBaseComposedProps, S extends RailBaseState> extends React.Component<P, S> {

  public static defaultProps: RailBaseDefaultProps = {
    type: 'RailBase',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    opposingJoints: [],
    enableJoints: true
  }

  railPart: RailPartBase<any, any>
  joints: Joint[]
  temporaryPivotJointIndex: number
  reasonablyCloseJoints: Joint[]


  constructor(props: P) {
    super(props)
    this.joints = new Array(this.NUM_JOINTS).fill(null)
    this.temporaryPivotJointIndex = 0
    this.reasonablyCloseJoints = null

    this.onRailPartLeftClick = this.onRailPartLeftClick.bind(this)
  }

  /**
   * このレールのジョイント数を返す。
   * 要実装。
   * @constructor
   */
  abstract get NUM_JOINTS()


  /**
   * レールパーツを左クリックしたら、レールの選択状態をトグルする。
   * @param {MouseEvent} e
   */
  onRailPartLeftClick(e: MouseEvent) {
    // レールの選択状態をトグルする
    this.props.builderToggleRail(this.props)
  }

  /**
   * ジョイントを右クリックしたら、仮レールが接続するジョイントを変更する
   * @param {number} jointId
   * @param {MouseEvent} e
   */
  onJointRightClick = (jointId: number, e: MouseEvent) => {
    // 仮レールのPivotJointをインクリメントする
    const numJoints = RailComponentClasses[this.props.temporaryItem.type].NUM_JOINTS
    const stride = RailComponentClasses[this.props.temporaryItem.type].PIVOT_JOINT_CHANGING_STRIDE
    this.temporaryPivotJointIndex = (this.temporaryPivotJointIndex + stride) % numJoints
    this.props.setTemporaryItem(update(this.props.temporaryItem, {
        pivotJointIndex: {$set: this.temporaryPivotJointIndex}
      }
    ))

    // 新たに仮レールの近傍ジョイントを探索して検出状態にする
    const temporaryRail = window.RAIL_COMPONENTS["-1"]
    this.undetectCloseJoints(true)
    this.detectCloseJoints(temporaryRail)
    LOGGER.info(`close joints: ${this.reasonablyCloseJoints}`)
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
    let opposingJoints = new Array(this.props.opposingJoints.length).fill(null)
    // このレールのIDとJointIDが対向ジョイント
    opposingJoints[this.temporaryPivotJointIndex] = {
      railId: this.props.id,
      jointId: jointId
    }

    // 仮レールの位置にレールを設置
    const newRail = {
      ...itemProps,
      id: this.props.nextRailId,
      position: (this.props.temporaryItem as any).position,
      angle: (this.props.temporaryItem as any).angle,
      layerId: this.props.activeLayerId,
      opposingJoints: opposingJoints,
      pivotJointIndex: this.temporaryPivotJointIndex
    }
    this.props.addRail(newRail)

    // 仮レールを消去する
    this.props.setTemporaryItem(null)

    // 近傍ジョイントを接続状態にする
    this.undetectCloseJoints(false)

    // LOGGER.info(`Rail-${this.props.id}-${cmb[0].props.data.partId} & Rail-${railData.id}-${cmb[1].props.data.partId}`) //`
    const jointPairs: JointPair[] = this.reasonablyCloseJoints.map(cmb => {
      return {
        from: {
          rail: this.props,
          jointId: cmb[0].props.data.partId
        },
        to: {
          rail: newRail,
          jointId: cmb[1].props.data.partId
        }
      }
    })

    this.props.builderConnectJoints(jointPairs)
  }

  /**
   * ジョイント上でマウスが動いた場合
   * 仮レールのジョイントが他のジョイントに十分近い場合、そのジョイントの検出状態を変更する
   * @param {number} jointId
   * @param {MouseEvent} e
   */
  onJointMouseMove = (jointId: number, e: MouseEvent) => {
    // 仮レールのマウントがまだ完了していなかったら何もしない
    const temporaryRail = window.RAIL_COMPONENTS["-1"]
    if (! temporaryRail) {
      return // noop
    }
    // すでに一度処理していたら何もしない
    if (this.reasonablyCloseJoints != null) {
      return // noop
    }
    // 仮レールの近傍にあるジョイントを検出中状態に変更する
    this.detectCloseJoints(temporaryRail)
  }

  /**
   * 指定のレールの近傍にあるジョイントを検出中状態に変更する
   * @param {RailBase<any, any>} rail
   */
  detectCloseJoints(rail: RailBase<any, any>) {
    let ret = []
    // 自分以外の全てのレールに対して実行する
    Object.keys(window.RAIL_COMPONENTS)
      .filter(id => id !== rail.props.id.toString())  // IDが文字列での比較になることに注意
      .map(k => window.RAIL_COMPONENTS[k])
      .forEach(target => {
        // 対象レールと指定レールのジョイントの組み合わせ
        const combinations = Combinatorics.cartesianProduct(target.joints, rail.joints).toArray()
        combinations.forEach(cmb => {
          // ジョイントが十分近ければリストに加える
          const isClose = pointsEqual(cmb[0].position, cmb[1].position, 0.1)
          if (isClose) {
            ret.push(cmb)
          }
        })
      })

    // 検出中状態にする
    ret.forEach(cmb => cmb[0].part.setState({
      detectionState: DetectionState.DETECTING,
      detectionPartVisible: true
    }))
    this.reasonablyCloseJoints = ret
  }

  /**
   * 全ての近傍ジョイントを非検出状態に戻す
   * @param {RailBase<any, any>} rail
   */
  undetectCloseJoints(doNullify: boolean) {
    if (this.reasonablyCloseJoints != null) {
      this.reasonablyCloseJoints.forEach(cmb => cmb[0].part.setState({
        detectionState: DetectionState.BEFORE_DETECT,
        detectionPartVisible: true
      }))
      if (doNullify) {
        this.reasonablyCloseJoints = null
      }
    }
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
      position: this.railPart.getGlobalJointPosition(jointId),
      angle: this.railPart.getGlobalJointAngle(jointId),
      layerId: 1,
      opacity: TEMPORARY_RAIL_OPACITY,
      pivotJointIndex: this.temporaryPivotJointIndex,
      enableJoints: false
    })

  }

  /**
   * ジョイントからマウスが離れたら、仮レールを消し、近傍ジョイントの検出状態を戻す
   * @param {number} jointId
   * @param {MouseEvent} e
   */
  onJointMouseLeave = (jointId: number, e: MouseEvent) => {
    this.props.setTemporaryItem(null)
    this.undetectCloseJoints(true)
  }

  componentDidUpdate() {
    this.setJointPositionsAndAngles()
  }

  componentDidMount() {
    this.setJointPositionsAndAngles()
    // HOCを用いる場合、refではラップされたコンテナを取得することになってしまう
    // そのためrefInstanceコールバックでコンポーネントインスタンスを取得する手段を与える
    this.props.refInstance(this)
  }

  /**
   * ジョイントコンポーネントを生成する
   * @returns {any[]}
   */
  protected createJointComponents() {
    const {id, opacity, opposingJoints, enableJoints} = this.props
    const {jointPositions, jointAngles} = this.state

    return _.range(this.joints.length).map(i => {
      return (
        <Joint
          position={jointPositions[i]}
          angle={jointAngles[i]}
          opacity={opacity}
          data={{
            type: 'Joint',
            partId: i,
            railId: id,
          }}
          detectionEnabled={enableJoints}
          hasOpposingJoint={opposingJoints[i] != null}
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

    // _.range(this.joints.length).forEach(i => {
    //   LOGGER.debug(`[Rail][${this.props.name}] Joint${i} position: ${this.state.jointPositions[i]} -> ${jointPositions[i]}`)
    //   LOGGER.debug(`[Rail][${this.props.name}] Joint${i} angle: ${this.state.jointAngles[i]} -> ${jointAngles[i]}`)
    // })

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

