import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import getLogger from "logging";
import {
  anglesEqual,
  getAllRailComponents,
  getRailComponent,
  getRailComponentsOfLayer,
  getTemporaryRailComponent,
  pointsEqual
} from "components/rails/utils";
import RailFactory from "components/rails/RailFactory";
import {PaletteItem, RootState} from "store/type";
import {deleteTemporaryRail, setTemporaryRail, setTemporaryRailGroup, updateTemporaryItem} from "actions/builder";
import {TEMPORARY_RAIL_OPACITY} from "constants/tools";
import {JointPair, WithBuilderProps} from "components/hoc/withBuilder";
import Combinatorics from "js-combinatorics"
import {DetectionState} from "components/rails/parts/primitives/DetectablePart";
import {addRail, addRailGroup} from "actions/layout";
import {nextRailGroupId, nextRailId, temporaryPivotJointIndex} from "selectors";
import {RailBase, RailBaseProps, RailBaseState} from "components/rails/RailBase";
import {connect} from "react-redux";
import {RailData, RailGroupData} from "components/rails/index";
import * as _ from "lodash";
import {RailGroupDataPayload} from "reducers/layout";

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
  onMount?: (ref: RailBase<RailBaseProps, RailBaseState>) => void
  onUnmount?: (ref: RailBase<RailBaseProps, RailBaseState>) => void

  // states
  paletteItem: PaletteItem
  temporaryRails: RailData[]
  temporaryPivotJointIndex: number
  temporaryRailGroup: RailGroupData
  activeLayerId: number
  nextRailId: number
  nextRailGroupId: number
  railGroups: RailGroupData[]

  // actionssetTemporaryRail
  setTemporaryRail: (item: RailData) => void
  setTemporaryRailGroup: (item: RailGroupDataPayload) => void
  updateTemporaryRail: (item: Partial<RailData>) => void
  deleteTemporaryRail: () => void
  addRail: (item: RailData, overwrite?: boolean) => void
  addRailGroup: (item: RailGroupData, children: RailData[], overwrite?: boolean) => void
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
      temporaryRails: state.builder.temporaryRails,
      temporaryRailGroup: state.builder.temporaryRailGroup,
      temporaryPivotJointIndex: temporaryPivotJointIndex(state),
      activeLayerId: state.builder.activeLayerId,
      nextRailId: nextRailId(state),
      nextRailGroupId: nextRailGroupId(state),
      railGroups: state.builder.railGroups,
    }
  }

  const mapDispatchToProps = (dispatch: any) => {
    return {
      setTemporaryRail: (item: RailData) => dispatch(setTemporaryRail(item)),
      setTemporaryRailGroup: (item: RailGroupDataPayload) => dispatch(setTemporaryRailGroup(item)),
      updateTemporaryRail: (item: Partial<RailData>) => dispatch(updateTemporaryItem(item)),
      deleteTemporaryRail: () => dispatch(deleteTemporaryRail({})),
      addRail: (item: RailData, overwrite = false) => dispatch(addRail({item, overwrite})),
      addRailGroup: (item: RailGroupData, children: RailData[], overwrite?: boolean) => dispatch(addRailGroup({item, children, overwrite}))
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

      this.closeJointPairs = []
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
      LOGGER.info(`${this.props.id} clicked.`)
      return true
    }

    /**
     * レールパーツを右クリックしたら？
     * @param {MouseEvent} e
     */
    onRailPartRightClick(e: MouseEvent) {
      return true
    }


    addRailGroup = (jointId: number, temporaryRails: RailData[], temporaryRailGroup: RailGroupData) => {
      const children = temporaryRails.map((temporaryRail, idx) => {
        // 仮レールのRailData
        // クリックしたジョイントを対向ジョイントにセットする
        let opposingJoints = {}
        opposingJoints[this.props.temporaryPivotJointIndex] = {
          railId: this.props.id,
          jointId: jointId
        }
        // 近傍ジョイントを対向ジョイントにセットする
        this.closeJointPairs.forEach(pair => {
          opposingJoints[pair.from.jointId] = {
            railId: pair.to.railId,
            jointId: pair.to.jointId
          }
        })

        return {
          ...temporaryRail,
          id: this.props.nextRailId + idx,    // IDを新規に割り振る(これだと削除して真ん中が空いた時にうまくいかない？）
          name: '',
          layerId: this.props.activeLayerId,  // 現在のレイヤーに置く
          opacity: 1,
          opposingJoints: opposingJoints,
          enableJoints: true,                 // ジョイントを有効化する
        }
      })

      this.props.addRailGroup({
        ...temporaryRailGroup,
        id: this.props.nextRailGroupId,       // IDを新規に割り振る
        name: '',
      }, children)
    }

    addRail = (jointId: number, temporaryItemData: RailData) => {
      // 仮レールのRailData
      // クリックしたジョイントを対向ジョイントにセットする
      let opposingJoints = {}
      opposingJoints[this.props.temporaryPivotJointIndex] = {
        railId: this.props.id,
        jointId: jointId
      }
      // 近傍ジョイントを対向ジョイントにセットする
      this.closeJointPairs.forEach(pair => {
        opposingJoints[pair.from.jointId] = {
          railId: pair.to.railId,
          jointId: pair.to.jointId
        }
      })

      // 仮レールの位置にレールを設置
      const newRailData = {
        ...temporaryItemData,
        id: this.props.nextRailId,          // IDを新規に割り振る
        name: '',
        layerId: this.props.activeLayerId,  // 現在のレイヤーに置く
        opacity: 1,
        opposingJoints: opposingJoints,
        enableJoints: true,                 // ジョイントを有効化する
      }
      LOGGER.info('newRailData', newRailData)

      this.props.addRail(newRailData)

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
        // return false
      }

      // 近傍ジョイントを非検出状態に戻す
      this.setCloseJointStates(DetectionState.BEFORE_DETECT)

      // 仮レールのRailData
      const temporaryRails = this.props.temporaryRails
      const temporaryRailGroup = this.props.temporaryRailGroup
      if (temporaryRailGroup) {
        this.addRailGroup(jointId, temporaryRails, temporaryRailGroup)
      } else {
        this.addRail(jointId, temporaryRails[0])
      }

      // 仮レールを消去する
      this.props.deleteTemporaryRail()

      this.searchCloseJoints()
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
      this.props.updateTemporaryRail({
        pivotJointIndex: temporaryPivotJointIndex
      })

      // 新たに仮レールの近傍ジョイントを探索して検出状態にする
      this.setCloseJointStates(DetectionState.BEFORE_DETECT)
      this.searchCloseJoints()
      this.setCloseJointStates(DetectionState.DETECTING)
      LOGGER.info(`close joints: ${this.closeJointPairs}`)
      // 検出状態は変更させない
      return false
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



    getRailProps = (paletteItem: PaletteItem) => {
      // パレットで選択したレール生成のためのPropsを取得
      if (paletteItem.type === 'RailGroup') {
        let railGroup = _.clone(this.props.railGroups.find(rg => rg.name === paletteItem.name)) as any
        railGroup.id = -1
        railGroup.rails.forEach((rail, idx) => {
          rail.id = -2-idx
        })
        return railGroup
      } else {
        return RailFactory[paletteItem.name]()
      }
    }

    /**
     * ジョイントにマウスが乗ったら、仮レールを表示する
     * @param {number} jointId
     * @param {MouseEvent} e
     */
    onJointMouseEnter = (jointId: number, e: MouseEvent) => {
      // パレットで選択したレール生成のためのPropsを取得
      const itemProps = this.getRailProps(this.props.paletteItem)
      if (itemProps.type === 'RailGroup') {
        const {rails, ...railGroupProps} = itemProps
        // レールグループのデータ
        const railGroup: RailGroupData = {
          ...railGroupProps,
          id: -1,
          name: 'TemporaryRailGroup',
          pivotRailIndex: 0,
          pivotJointIndex: 0,
          position: this.railPart.getGlobalJointPosition(jointId),
          angle: this.railPart.getGlobalJointAngle(jointId),
        }
        // レールグループに所属するレールデータ
        const children = rails.map(r => {
          return {
            ...r,
            enableJoints: false   // ジョイント無効
          }
        })

        // 仮レールグループを設置する
        this.props.setTemporaryRailGroup({
          item: railGroup,
          children: children
        })
        LOGGER.info('TemporaryRailGroup', railGroup, children)

      } else {
        // このレールと仮レールの両方がカーブレールの場合、PivotJoint (=向き)を揃える
        let pivotJointIndex = this.props.temporaryPivotJointIndex
        if (pivotJointIndex == null) {
          if (this.props.type === 'CurveRail' && itemProps.type === 'CurveRail') {
            pivotJointIndex = this.props.pivotJointIndex
          } else {
            pivotJointIndex = 0
          }
        }
        // 仮レールを設置する
        this.props.setTemporaryRail({
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
        LOGGER.info('TemporaryRail', itemProps)
      }
    }

    /**
     * ジョイントからマウスが離れたら、仮レールを消し、近傍ジョイントの検出状態を戻す
     * @param {number} jointId
     * @param {MouseEvent} e
     */
    onJointMouseLeave = (jointId: number, e: MouseEvent) => {
      this.props.updateTemporaryRail({visible: false})
      this.setCloseJointStates(DetectionState.BEFORE_DETECT)
    }

    /**
     * マウント時に呼ばれるコールバック
     * RailComponentクラスを取得するために用いる
     */
    onMount = (ref: RailBase<RailBaseProps, RailBaseState>) => {
      this.rail = ref
      if (this.props.onMount) {
        this.props.onMount(ref)
      }
    }

    /**
     * アンマウント時に呼ばれるコールバック
     */
    onUnmount = (ref: RailBase<RailBaseProps, RailBaseState>) => {
      if (this.props.onUnmount) {
        this.props.onUnmount(ref)
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
      // console.log(getRailComponentsOfLayer(this.props.activeLayerId))
      getAllRailComponents()
      // .filter(r => r.props.id !== this.props.id)
        .forEach(target => {
          // 仮レールと対向レールのジョイントの組み合わせ
          const combinations = Combinatorics.cartesianProduct(temporaryRail.joints, target.joints).toArray()
          combinations.forEach(cmb => {
            // 両方が未接続でなければ抜ける
            if (cmb[0].props.hasOpposingJoint || cmb[1].props.hasOpposingJoint) {
              return
            }
            // ジョイント同士が十分近く、かつ角度が一致していればリストに加える
            // LOGGER.debug(cmb[0].props.data.railId, cmb[0].globalPosition, cmb[0].angle, cmb[1].props.data.railId, cmb[1].globalPosition, cmb[1].angle)
            const isClose = pointsEqual(cmb[0].globalPosition, cmb[1].globalPosition, 0.1)
            const isSameAngle = anglesEqual(cmb[0].angle, cmb[1].angle + 180, 0.1)
            if (isClose && isSameAngle) {
              closeJointPairs.push({
                from: {
                  railId: this.props.nextRailId,
                  // railId: cmb[0].props.id,
                  jointId: cmb[0].props.data.partId
                },
                to: {
                  railId: target.props.id,
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
      if (this.closeJointPairs.length > 0) {
        // 仮レールの対向レールのジョイントの状態を変更する
        this.closeJointPairs.forEach(pair => {
          const rail = getRailComponent(pair.to.railId)
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
      const excludedRailIds = [this.props.id].concat(this.closeJointPairs.map(pair => pair.to.railId))
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
          onMount={(instance) => this.onMount(instance)}
          onUnmount={(instance) => this.onUnmount(instance)}
        />
      )
    }
  }

  return connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(WithRailBase)
}

