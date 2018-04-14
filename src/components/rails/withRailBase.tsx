import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import getLogger from "logging";
import {
  getRailComponentsOfLayer,
  getTemporaryRailComponent,
  getTemporaryRailGroupComponent
} from "components/rails/utils";
import RailFactory from "components/rails/RailFactory";
import {PaletteItem, RootState} from "store/type";
import {
  deleteTemporaryRail,
  setTemporaryRail,
  setTemporaryRailGroup,
  updateTemporaryItem,
  updateTemporaryRailGroup
} from "actions/builder";
import {TEMPORARY_RAIL_OPACITY} from "constants/tools";
import {JointPair, WithBuilderProps} from "components/hoc/withBuilder";
import Combinatorics from "js-combinatorics"
import {addRail, addRailGroup} from "actions/layout";
import {nextRailGroupId, nextRailId, temporaryPivotJointIndex} from "selectors";
import {RailBase, RailBaseProps, RailBaseState} from "components/rails/RailBase";
import {connect} from "react-redux";
import {RailData, RailGroupData} from "components/rails/index";
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
  userRailGroups: RailGroupData[]

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

  const mapStateToProps = (state: RootState) => {
    return {
      paletteItem: state.builder.paletteItem,
      temporaryRails: state.builder.temporaryRails,
      temporaryRailGroup: state.builder.temporaryRailGroup,
      temporaryPivotJointIndex: temporaryPivotJointIndex(state),
      activeLayerId: state.builder.activeLayerId,
      nextRailId: nextRailId(state),
      nextRailGroupId: nextRailGroupId(state),
      userRailGroups: state.builder.userRailGroups,
    }
  }

  const mapDispatchToProps = (dispatch: any) => {
    return {
      setTemporaryRail: (item: RailData) => dispatch(setTemporaryRail(item)),
      updateTemporaryRail: (item: Partial<RailData>) => dispatch(updateTemporaryItem(item)),
      deleteTemporaryRail: () => dispatch(deleteTemporaryRail({})),
      setTemporaryRailGroup: (item: RailGroupDataPayload) => dispatch(setTemporaryRailGroup(item)),
      updateTemporaryRailGroup: (item: Partial<RailGroupData>) => dispatch(updateTemporaryRailGroup(item)),
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
     * レールパーツを右クリックした場合
     * 現状何もしない
     * @param {MouseEvent} e
     */
    onRailPartRightClick(e: MouseEvent) {
      return true
    }


    addRailGroup = (jointId: number, temporaryRails: RailData[], temporaryRailGroup: RailGroupData) => {
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

    addRail = (jointId: number, temporaryRail: RailData) => {
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
      } else {
        this.addRail(jointId, temporaryRails[0])
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
      const temporaryRailGroup = getTemporaryRailGroupComponent()
      if (temporaryRailGroup) {
        const groupProps = this.getRailProps(this.props.paletteItem)
        const nextPivotJointInfo = groupProps.openJoints[this.props.temporaryPivotJointIndex]
        this.props.updateTemporaryRailGroup({
          pivotRailIndex: nextPivotJointInfo.railId,
          pivotJointIndex: nextPivotJointInfo.jointId
        })
      } else {
        const temporaryRail = getTemporaryRailComponent()
        const {numJoints, pivotJointChangingStride} = temporaryRail.props
        // 仮レールのPivotJointIndexを加算する
        let temporaryPivotJointIndex = (this.props.temporaryPivotJointIndex + pivotJointChangingStride) % numJoints
        this.props.updateTemporaryRail({
          pivotJointIndex: temporaryPivotJointIndex
        })
      }

      return false
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


    getRailProps = (paletteItem: PaletteItem) => {
      // パレットで選択したレール生成のためのPropsを取得
      if (paletteItem.type === 'RailGroup') {
        // 同名のレールグループを取得する
        return _.clone(this.props.userRailGroups.find(rg => rg.name === paletteItem.name))
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

        let pivotJointIndex = this.props.temporaryPivotJointIndex
        if (pivotJointIndex == null) {
          pivotJointIndex = 0
        }

        // レールグループのデータ
        const railGroup: RailGroupData = {
          ...railGroupProps,
          id: -1,
          name: 'TemporaryRailGroup',
          pivotRailIndex: railGroupProps.openJoints[pivotJointIndex].pivotRailIndex,
          pivotJointIndex: railGroupProps.openJoints[pivotJointIndex].pivotJointIndex,
          position: this.railPart.getGlobalJointPosition(jointId),
          angle: this.railPart.getGlobalJointAngle(jointId),
        }
        // レールグループに所属するレールデータ
        const children = rails.map(r => {
          return {
            ...r,
            enableJoints: false,   // ジョイント無効
            visible: true,
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
          enableJoints: false,
          visible: true,
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
      // PivotJointIndexを保存しておきたいので、削除するのではなく不可視にする
      this.props.updateTemporaryRail({visible: false})
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

