import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import getLogger from "logging";
import {pointsEqual} from "components/Rails/utils";
import RailFactory from "components/Rails/RailFactory";
import {PaletteItem, RootState} from "store/type";
import {setTemporaryItem, setTemporaryPivotJoint} from "actions/builder";
import {TEMPORARY_RAIL_OPACITY} from "constants/tools";
import {JointPair, WithBuilderProps} from "components/hoc/withBuilder";
import Combinatorics from "js-combinatorics"
import {DetectionState} from "components/Rails/RailParts/Parts/DetectablePart";
import {addRail} from "actions/layout";
import {nextRailId, temporaryPivotJointIndex} from "selectors";
import {RailBase, RailBaseProps} from "components/Rails/RailBase";
import {connect} from "react-redux";
import {RailData} from "components/Rails/index";

const LOGGER = getLogger(__filename)


export interface WithRailBaseProps {
  // Injected Props
  onRailPartLeftClick: (e: MouseEvent) => boolean
  onRailPartRightClick: (e: MouseEvent) => boolean
  onJointLeftClick: (jointId: number, e: MouseEvent) => boolean
  onJointRightClick: (jointId: number, e: MouseEvent) => boolean
  onJointMouseMove: (jointId: number, e: MouseEvent) => void
  onJointMouseEnter: (jointId: number, e: MouseEvent) => void
  onJointMouseLeave: (jointId: number, e: MouseEvent) => void
  refInstance?: (ref: RailBase<any, any>) => void

  // states
  paletteItem: PaletteItem
  temporaryItem: RailData
  temporaryPivotJointIndex: number
  activeLayerId: number
  nextRailId: number
  // actions
  setTemporaryItem: (item: RailData) => void
  setTemporaryPivotJoint: (index: number) => void
  addRail: (item: RailData, overwrite?: boolean) => void
}

export type RailBaseContainerProps = RailBaseProps & WithRailBaseProps & WithBuilderProps


/**
 * Railの各種イベントハンドラを提供するHOC
 * 依存: WithBuilder
 */
export default function withRailBase(WrappedComponent: React.ComponentClass<RailBaseProps>) {

  const mapStateToProps = (state: RootState) => {
    return {
      paletteItem: state.builder.paletteItem,
      temporaryItem: state.builder.temporaryItem,
      temporaryPivotJointIndex: temporaryPivotJointIndex(state),
      activeLayerId: state.builder.activeLayerId,
      nextRailId: nextRailId(state),
    }
  }

  const mapDispatchToProps = (dispatch: any) => {
    return {
      setTemporaryItem: (item: RailData) => dispatch(setTemporaryItem(item)),
      setTemporaryPivotJoint: (index: number) => dispatch(setTemporaryPivotJoint(index)),
      addRail: (item: RailData, overwrite = false) => dispatch(addRail({item, overwrite})),
    }
  }

  class WithRailBase extends React.Component<RailBaseContainerProps, {}> {

    constructor(props: RailBaseContainerProps) {
      super(props)

      this.onRailPartLeftClick = this.onRailPartLeftClick.bind(this)
      this.onRailPartRightClick = this.onRailPartRightClick.bind(this)
      this.onJointLeftClick = this.onJointLeftClick.bind(this)
      this.onJointRightClick = this.onJointRightClick.bind(this)
      this.onJointMouseMove = this.onJointMouseMove.bind(this)
      this.onJointMouseEnter = this.onJointMouseEnter.bind(this)
      this.onJointMouseLeave = this.onJointMouseLeave.bind(this)

      this.closeJointPairs = null
    }

    rail: RailBase<any, any>
    closeJointPairs: JointPair[]

    get railPart() { return this.rail.railPart }
    get joints() { return this.rail.joints }

    // TODO: これでOK?
    // shouldComponentUpdate() {
    //   return false
    // }

    /**
     * レールパーツを左クリックしたら、レールの選択状態をトグルする。
     * @param {MouseEvent} e
     */
    onRailPartLeftClick(e: MouseEvent) {
      // レールの選択状態をトグルする
      this.props.builderToggleRail(this.props)
      return true
    }

    /**
     * レールパーツを右クリックしたら？
     * @param {MouseEvent} e
     */
    onRailPartRightClick(e: MouseEvent) {
      return true
    }

    /**
     * ジョイントを左クリックしたら、仮レールの位置にレールを設置する
     * この時近くに接続できそうなジョイントがあったら自動的に接続する
     * @param {number} jointId
     * @param {MouseEvent} e
     */
    onJointLeftClick = (jointId: number, e: MouseEvent) => {
      // 仮レールがこのレイヤーの他のレールと重なっていたら、何もせずに返る
      const intersects = this.temporaryRailIntersects()
      if (intersects) {
        LOGGER.info("Rail intersects.")
        // ジョイントの検出状態を変更させない
        return false
      }

      // 近傍ジョイントを非検出状態に戻す
      this.setCloseJointStates(DetectionState.BEFORE_DETECT)

      // 仮レールのRailData
      const temporaryItemData = this.props.temporaryItem
      // クリックしたジョイントを対向ジョイントにセットする
      let opposingJoints = new Array(this.props.opposingJoints.length).fill(null)
      opposingJoints[this.props.temporaryPivotJointIndex] = {
        railId: this.props.id,
        jointId: jointId
      }
      // 近傍ジョイントを対向ジョイントにセットする
      this.closeJointPairs.forEach(pair => {
        opposingJoints[pair.from.jointId] = {
          railId: pair.to.rail.id,
          jointId: pair.to.jointId
        }
      })

      // 仮レールの位置にレールを設置
      const newRailData = {
        ...temporaryItemData,
        id: this.props.nextRailId,
        name: '',
        layerId: this.props.activeLayerId,
        opacity: 1,
        opposingJoints: opposingJoints,
        enableJoints: true,
      }
      this.props.addRail(newRailData)

      // 仮レールを消去する
      this.props.setTemporaryItem(null)
      // クリックされたジョイント、近傍ジョイントを接続する
      this.props.builderConnectJoints(this.closeJointPairs)
      // ジョイントの検出状態を変更させる
      return true
    }

    /**
     * ジョイントを右クリックしたら、仮レールが接続するジョイントを変更する
     * @param {number} jointId
     * @param {MouseEvent} e
     */
    onJointRightClick = (jointId: number, e: MouseEvent) => {
      const temporaryRail = getTemporaryRailComponent()
      const numJoints = temporaryRail.props.numJoints
      const stride = temporaryRail.props.pivotJointChangingStride

      // 仮レールのPivotJointを加算する
      let temporaryPivotJointIndex = (this.props.temporaryPivotJointIndex + stride) % numJoints
      this.props.setTemporaryPivotJoint(temporaryPivotJointIndex)

      // 新たに仮レールの近傍ジョイントを探索して検出状態にする
      this.setCloseJointStates(DetectionState.BEFORE_DETECT)
      this.searchCloseJoints()
      this.setCloseJointStates(DetectionState.DETECTING)
      LOGGER.info(`close joints: ${this.closeJointPairs}`)
      return true
    }

    /**
     * ジョイント上でマウスが動いた場合
     * 仮レールのジョイントが他のジョイントに十分近い場合、そのジョイントの検出状態を変更する
     * @param {number} jointId
     * @param {MouseEvent} e
     */
    onJointMouseMove = (jointId: number, e: MouseEvent) => {
      // 仮レールのマウントがまだ完了していなかったら何もしない
      const temporaryRail = getTemporaryRailComponent()
      if (!temporaryRail) {
        return // noop
      }
      // 仮レールの近傍にあるジョイントを検出中状態に変更する
      this.searchCloseJoints()
      this.setCloseJointStates(DetectionState.DETECTING)
    }

    /**
     * ジョイントにマウスが乗ったら、仮レールを表示する
     * @param {number} jointId
     * @param {MouseEvent} e
     */
    onJointMouseEnter = (jointId: number, e: MouseEvent) => {
      // パレットで選択したレール生成のためのPropsを取得
      const itemProps = RailFactory[this.props.paletteItem.name]()

      // カーブレールに接続する場合、PivotJoint (=向き)を揃える
      let pivotJointIndex
      if (this.props.type === 'CurveRail' && itemProps.type === 'CurveRail') {
        pivotJointIndex = this.props.pivotJointIndex
      } else {
        pivotJointIndex = this.props.temporaryPivotJointIndex
      }

      // 仮レールを設置する
      this.props.setTemporaryItem({
        ...itemProps,
        id: -1,
        name: 'TemporaryRail',
        position: this.railPart.getGlobalJointPosition(jointId),
        angle: this.railPart.getGlobalJointAngle(jointId),
        layerId: -1,
        opacity: TEMPORARY_RAIL_OPACITY,
        pivotJointIndex: pivotJointIndex,
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
      this.setCloseJointStates(DetectionState.BEFORE_DETECT)
    }

    /**
     * RailComponentクラスを取得するためのコールバック
     * @param {RailBase<any, any>} instance
     */
    refInstance = (instance: RailBase<any, any>) => {
      this.rail = instance
      if (this.props.refInstance) {
        this.props.refInstance(instance)
      }
    }

    /**
     * 仮レールのジョイントの近傍にある対向レールのジョイントを探索する
     */
    private searchCloseJoints() {
      let closeJointPairs: JointPair[] = []
      // 仮レール
      const temporaryRail = getTemporaryRailComponent()
      // 自分以外の全てのレールに対して実行する
      getRailComponentsOfLayer(this.props.activeLayerId)
      // .filter(r => r.props.id !== this.props.id)
        .forEach(target => {
          // 仮レールと対向レールのジョイントの組み合わせ
          const combinations = Combinatorics.cartesianProduct(temporaryRail.joints, target.joints).toArray()
          combinations.forEach(cmb => {
            // ジョイントが十分近ければリストに加える
            LOGGER.debug(cmb)
            const isClose = pointsEqual(cmb[0].position, cmb[1].position, 0.1)
            if (isClose) {
              closeJointPairs.push({
                from: {
                  rail: temporaryRail.props,
                  jointId: cmb[0].props.data.partId
                },
                to: {
                  rail: target.props,
                  jointId: cmb[1].props.data.partId
                }
              })
            }
          })
        })

      this.closeJointPairs = closeJointPairs
    }

    /**
     * 探索した近傍ジョイントの状態を変更する
     * @param {DetectionState} state
     */
    private setCloseJointStates(state: DetectionState) {
      if (this.closeJointPairs != null) {
        // 仮レールの対向レールのジョイントの状態を変更する
        this.closeJointPairs.forEach(pair => {
          const rail = getRailComponent(pair.to.rail.id)
          rail.joints[pair.to.jointId].part.setState({
            detectionState: state,
            detectionPartVisible: true
          })
        })
      }
    }

    /**
     * 仮レールが現在のレイヤーの他のレールに衝突しているかどうか調べる
     */
    private temporaryRailIntersects(): boolean {
      // 仮レールを構成するPathオブジェクト
      const targetRailPaths = getTemporaryRailComponent().railPart.path.children
      // 近傍ジョイントを持つレールは衝突検査の対象から外す
      const excludedRailIds = this.closeJointPairs.map(pair => pair.to.rail.id)
      LOGGER.debug(`exluded: ${excludedRailIds}`) //`
      // 現在のレイヤーにおける各レールと仮レールが衝突していないか調べる
      const result = getRailComponentsOfLayer(this.props.activeLayerId)
        .filter(r => ! excludedRailIds.includes(r.props.id))
        .map(r => r.railPart.path)
        .map(group => {
          // 両レールを構成するパス同士の組み合わせを作成し、重なりを調べる
          const combinations = Combinatorics.cartesianProduct(group.children, targetRailPaths).toArray()
          const result = combinations.map(cmb => cmb[0].intersects(cmb[1])).every(e => e)
          LOGGER.debug(`Rail ${group.data.railId}: ${result}`)
          return result
        })
        .some(e => e)   // 重なっているものが一つ以上あればtrue

      return result
    }


    render() {
      return (
        <WrappedComponent
          {...this.props}
          onRailPartLeftClick={this.onRailPartLeftClick}
          onRailPartRightClick={this.onRailPartRightClick}
          onJointLeftClick={this.onJointLeftClick}
          onJointRightClick={this.onJointRightClick}
          onJointMouseMove={this.onJointMouseMove}
          onJointMouseEnter={this.onJointMouseEnter}
          onJointMouseLeave={this.onJointMouseLeave}
          refInstance={(instance) => this.refInstance(instance)}
        />
      )
    }
  }

  return connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(WithRailBase)
}

const getRailComponent = (id: number): RailBase<RailBaseProps, any> => {
  return window.RAIL_COMPONENTS[id.toString()]
}

const getTemporaryRailComponent = (): RailBase<RailBaseProps, any> => {
  return window.RAIL_COMPONENTS["-1"]
}

const getAllRailComponents = (): Array<RailBase<RailBaseProps, any>> => {
  return Object.keys(window.RAIL_COMPONENTS).map(key => window.RAIL_COMPONENTS[key])
}

const getRailComponentsOfLayer = (layerId: number): Array<RailBase<RailBaseProps, any>> => {
  return getAllRailComponents().filter(r => r.props.layerId === layerId)
}
