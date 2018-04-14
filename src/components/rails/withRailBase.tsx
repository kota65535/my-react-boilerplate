import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import getLogger from "logging";
import {getAllRailComponents, getRailComponent} from "components/rails/utils";
import {PaletteItem, RootState} from "store/type";
import {
  deleteTemporaryRail,
  setTemporaryRail,
  setTemporaryRailGroup,
  updateTemporaryItem,
  updateTemporaryRailGroup
} from "actions/builder";
import {TEMPORARY_RAIL_OPACITY} from "constants/tools";
import {WithBuilderProps} from "components/hoc/withBuilder";
import Combinatorics from "js-combinatorics"
import {addRail, addRailGroup} from "actions/layout";
import {
  nextPivotJointIndex,
  nextPivotJointInfo,
  nextRailGroupId,
  nextRailId,
  paletteRailData,
  paletteRailGroupData,
} from "selectors";
import {JointInfo, RailBase, RailBaseProps, RailBaseState} from "components/rails/RailBase";
import {connect} from "react-redux";
import {RailData, RailGroupData} from "components/rails/index";
import {RailGroupDataPayload} from "reducers/layout";
import {UserRailGroupData} from "reducers/builder";

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
  temporaryRailGroup: RailGroupData
  activeLayerId: number
  nextRailId: number
  nextRailGroupId: number
  userRailGroups: UserRailGroupData[]
  nextPivotJointIndex: number
  nextPivotJointInfo: JointInfo
  paletteRailData: RailData,
  paletteRailGroupData: UserRailGroupData

  // actionssetTemporaryRail
  setTemporaryRail: (item: RailData) => void
  updateTemporaryRail: (item: Partial<RailData>) => void
  deleteTemporaryRail: () => void
  setTemporaryRailGroup: (item: RailGroupDataPayload) => void
  updateTemporaryRailGroup: (item: Partial<RailGroupData>) => void
  addRail: (item: RailData, overwrite?: boolean) => void
  addRailGroup: (item: RailGroupData, children: RailData[], overwrite?: boolean) => void
}

export type RailBaseContainerProps = RailBaseProps & WithRailBaseProps & WithBuilderProps


/**
 * Railの各種イベントハンドラを提供するHOC
 * 依存: WithBuilder
 */
export default function withRailBase(WrappedComponent: React.ComponentClass<RailBaseProps>) {

  const mapStateToProps = (state: RootState): Partial<WithRailBaseProps> => {
    return {
      paletteItem: state.builder.paletteItem,
      temporaryRails: state.builder.temporaryRails,
      temporaryRailGroup: state.builder.temporaryRailGroup,
      activeLayerId: state.builder.activeLayerId,
      nextRailId: nextRailId(state),
      nextRailGroupId: nextRailGroupId(state),
      userRailGroups: state.builder.userRailGroups,
      nextPivotJointIndex: nextPivotJointIndex(state),
      nextPivotJointInfo: nextPivotJointInfo(state),
      paletteRailData: paletteRailData(state),
      paletteRailGroupData: paletteRailGroupData(state),
    }
  }

  const mapDispatchToProps = (dispatch: any): Partial<WithRailBaseProps> => {
    return {
      setTemporaryRail: (item: RailData) => dispatch(setTemporaryRail(item)),
      updateTemporaryRail: (item: Partial<RailData>) => dispatch(updateTemporaryItem(item)),
      deleteTemporaryRail: () => dispatch(deleteTemporaryRail({})),
      setTemporaryRailGroup: (item: RailGroupDataPayload) => dispatch(setTemporaryRailGroup(item)),
      updateTemporaryRailGroup: (item: Partial<RailGroupData>) => dispatch(updateTemporaryRailGroup(item)),
      addRail: (item: RailData, overwrite = false) => dispatch(addRail({item, overwrite})),
      addRailGroup: (item: RailGroupData, children: RailData[], overwrite?: boolean) => dispatch(addRailGroup({
        item,
        children,
        overwrite
      }))
    }
  }

  class WithRailBase extends React.Component<RailBaseContainerProps, {}> {

    rail: RailBase<any, any>

    constructor(props: RailBaseContainerProps) {
      super(props)

      this.onRailPartLeftClick = this.onRailPartLeftClick.bind(this)
      this.onRailPartRightClick = this.onRailPartRightClick.bind(this)
      this.onJointLeftClick = this.onJointLeftClick.bind(this)
      this.onJointRightClick = this.onJointRightClick.bind(this)
      this.onJointMouseMove = this.onJointMouseMove.bind(this)
      this.onJointMouseEnter = this.onJointMouseEnter.bind(this)
      this.onJointMouseLeave = this.onJointMouseLeave.bind(this)
    }

    get railPart() {
      return this.rail.railPart
    }

    get joints() {
      return this.rail.joints
    }

    /**
     * ジョイントにマウスが乗ったら、仮レールを表示する
     * @param {number} jointId
     * @param {MouseEvent} e
     */
    onJointMouseEnter = (jointId: number, e: MouseEvent) => {
      if (this.props.paletteRailGroupData) {
        this.showTemporaryRailGroup(jointId)
      } else if (this.props.paletteRailData) {
        this.showTemporaryRail(jointId)
      }
    }


    /**
     * ジョイント上でマウスが動いた場合
     * 現状特に何もしない
     * @param {number} jointId
     * @param {MouseEvent} e
     */
    onJointMouseMove = (jointId: number, e: MouseEvent) => {
      // noop
    }


    /**
     * ジョイントからマウスが離れたら、仮レールを隠す
     * @param {number} jointId
     * @param {MouseEvent} e
     */
    onJointMouseLeave = (jointId: number, e: MouseEvent) => {
      // PivotJointIndexを保存しておきたいので、削除するのではなく不可視にする
      this.props.updateTemporaryRail({visible: false})
    }


    /**
     * ジョイントを左クリックしたら、仮レールの位置にレールを設置する
     * @param {number} jointId
     * @param {MouseEvent} e
     */
    onJointLeftClick = (jointId: number, e: MouseEvent) => {
      // 仮レールがこのレイヤーの他のレールと重なっていたら、何もせずに返る
      // const intersects = this.temporaryRailIntersects()
      // if (intersects) {
      //   LOGGER.info("Rail intersects.")
      //   // ジョイントの検出状態を変更させない
      //   return false
      // }

      // 仮レールのRailData
      const temporaryRails = this.props.temporaryRails
      const temporaryRailGroup = this.props.temporaryRailGroup
      if (temporaryRailGroup) {
        this.addRailGroup(jointId, temporaryRails, temporaryRailGroup)
      } else if (temporaryRails.length > 0) {
        this.addRail(jointId, temporaryRails[0])
      } else {
        return false
      }
      // 仮レールを消去する
      this.props.deleteTemporaryRail()
      // ジョイントの検出状態を変更させる
      return true
    }


    /**
     * ジョイントを右クリックしたら、仮レールが接続するジョイントを変更する
     * @param {number} jointId
     * @param {MouseEvent} e
     */
    onJointRightClick = (jointId: number, e: MouseEvent) => {
      if (this.props.temporaryRailGroup) {
        // レールグループの場合
        this.props.updateTemporaryRailGroup({
          pivotJointInfo: this.props.nextPivotJointInfo
        })
      } else if (this.props.temporaryRails) {
        // 単体レールの場合
        this.props.updateTemporaryRail({
          pivotJointIndex: this.props.nextPivotJointIndex
        })
      }
      // ジョイントの検出状態は変更しない
      return false
    }


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
     * レールパーツを右クリックした場合
     * 現状何もしない
     * @param {MouseEvent} e
     */
    onRailPartRightClick(e: MouseEvent) {
      return true
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


    render() {
      return (
        <WrappedComponent
          {...this.props}
          onJointMouseEnter={this.onJointMouseEnter}
          onJointMouseMove={this.onJointMouseMove}
          onJointMouseLeave={this.onJointMouseLeave}
          onJointLeftClick={this.onJointLeftClick}
          onJointRightClick={this.onJointRightClick}
          onRailPartLeftClick={this.onRailPartLeftClick}
          onRailPartRightClick={this.onRailPartRightClick}
          onMount={(instance) => this.onMount(instance)}
          onUnmount={(instance) => this.onUnmount(instance)}
        />
      )
    }

    /**
     * 仮レールが現在のレイヤーの他のレールに衝突しているかどうか調べる
     */
    private temporaryRailIntersects(): boolean {
      // 全ての仮レールを構成するPathオブジェクト群を取得
      const temporaryRailComponents = this.props.temporaryRails.map(r => getRailComponent(r.id))
      const targetRailPaths = _.flatMap(temporaryRailComponents, rc => rc.railPart.path.children)
      // 近傍ジョイントを持つレールは衝突検査の対象から外す
      // const excludedRailIds = [this.props.id].concat(this.closeJointPairs.map(pair => pair.to.railId))
      // LOGGER.debug(`exluded: ${excludedRailIds}`) //`
      // 現在のレイヤーにおける各レールと仮レールが衝突していないか調べる
      const result = getAllRailComponents()
      // .filter(r => ! excludedRailIds.includes(r.props.id))
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


    /**
     * 仮レールをもとにレールグループをレイアウトに追加する
     * @param {number} jointId
     * @param {RailData[]} temporaryRails
     * @param {RailGroupData} temporaryRailGroup
     */
    private addRailGroup = (jointId: number, temporaryRails: RailData[], temporaryRailGroup: RailGroupData) => {
      const children = temporaryRails.map((temporaryRail, idx) => {
        return {
          ...temporaryRail,
          id: this.props.nextRailId + idx,    // IDを新規に割り振る
          name: '',
          layerId: this.props.activeLayerId,  // 現在のレイヤーに置く
          opacity: 1,
          opposingJoints: {},
          enableJoints: true,                 // ジョイントを有効化する
        }
      })

      this.props.addRailGroup({
        ...temporaryRailGroup,
        id: this.props.nextRailGroupId,       // IDを新規に割り振る
        name: '',
      }, children)
    }


    /**
     * 仮レールをもとにレールをレイアウトに追加する
     * @param {number} jointId
     * @param {RailData} temporaryRail
     */
    private addRail = (jointId: number, temporaryRail: RailData) => {
      // 仮レールの位置にレールを設置
      const newRailData = {
        ...temporaryRail,
        id: this.props.nextRailId,          // IDを新規に割り振る
        name: '',
        layerId: this.props.activeLayerId,  // 現在のレイヤーに置く
        opacity: 1,
        // opposingJoints: [],
        enableJoints: true,                 // ジョイントを有効化する
      }
      LOGGER.info('newRailData', newRailData)

      this.props.addRail(newRailData)
    }


    /**
     * 仮レールグループを表示する
     * @param {number} jointId
     */
    private showTemporaryRailGroup = (jointId: number) => {
      const {rails, openJoints} = this.props.paletteRailGroupData

      // PivotJointの設定
      let pivotJointInfo
      if (this.props.temporaryRailGroup == null) {
        pivotJointInfo = openJoints[0]
      } else {
        pivotJointInfo = this.props.temporaryRailGroup.pivotJointInfo
      }

      // レールグループデータの作成
      const railGroup: RailGroupData = {
        type: 'RailGroup',
        id: -1,
        name: 'TemporaryRailGroup',
        pivotJointInfo: pivotJointInfo,
        position: this.railPart.getGlobalJointPosition(jointId),
        angle: this.railPart.getGlobalJointAngle(jointId),
        rails: []
      }

      // レールグループに所属するレールデータの作成
      const children = rails.map((r, idx) => {
        return {
          ...r,
          id: -2 - idx,
          name: 'TemporaryRail',
          layerId: this.props.activeLayerId,
          enableJoints: false,                  // ジョイント無効
          opacity: TEMPORARY_RAIL_OPACITY,
          visible: true,
        }
      })

      // 仮レールグループを設置する
      this.props.setTemporaryRailGroup({
        item: railGroup,
        children: children
      })
      LOGGER.info('TemporaryRailGroup', railGroup, children)
    }


    /**
     * 仮レールを表示する。
     * @param {number} jointId
     */
    private showTemporaryRail = (jointId: number) => {
      const railData = this.props.paletteRailData
      // PivotJointを設定する
      let pivotJointIndex
      if (_.isEmpty(this.props.temporaryRails)) {
        pivotJointIndex = this.initializePivotJointIndex(railData)
      } else {
        pivotJointIndex = this.props.temporaryRails[0].pivotJointIndex
      }

      // 仮レールを設置する
      this.props.setTemporaryRail({
        ...railData,
        id: -1,
        name: 'TemporaryRail',
        position: this.railPart.getGlobalJointPosition(jointId),
        angle: this.railPart.getGlobalJointAngle(jointId),
        layerId: -1,
        pivotJointIndex: pivotJointIndex,
        enableJoints: false,
        opacity: TEMPORARY_RAIL_OPACITY,
        visible: true,
      })
      LOGGER.info('TemporaryRail', railData)
    }


    private initializePivotJointIndex = (paletteRailData: RailData) => {
      // このレールと仮レールの両方がカーブレールの場合、PivotJoint (=向き)を揃える
      if (this.props.type === 'CurveRail' && paletteRailData.type === 'CurveRail') {
        return this.props.pivotJointIndex
      } else {
        return 0
      }
    }

  }

  return connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(WithRailBase)
}

