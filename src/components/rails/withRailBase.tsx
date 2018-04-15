import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import getLogger from "logging";
import {RootState} from "store/type";
import {
  deleteTemporaryRail,
  setTemporaryRail,
  setTemporaryRailGroup,
  updateTemporaryItem,
  updateTemporaryRailGroup
} from "actions/builder";
import {TEMPORARY_RAIL_OPACITY} from "constants/tools";
import {default as withBuilder, WithBuilderPublicProps} from "components/hoc/withBuilder";
import {addRail, addRailGroup} from "actions/layout";
import {nextPivotJointIndex, nextPivotJointInfo, nextRailGroupId, nextRailId,} from "selectors";
import {JointInfo, RailBase, RailBaseProps, RailBaseState} from "components/rails/RailBase";
import {connect} from "react-redux";
import {RailData, RailGroupData} from "components/rails/index";
import {RailGroupDataPayload} from "reducers/layout";
import {UserRailGroupData} from "reducers/builder";
import {compose} from "recompose";

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
  temporaryRails: RailData[]
  temporaryRailGroup: RailGroupData
  activeLayerId: number
  nextRailId: number
  nextRailGroupId: number
  userRailGroups: UserRailGroupData[]
  nextPivotJointIndex: number
  nextPivotJointInfo: JointInfo
  intersects: boolean

  // actionssetTemporaryRail
  setTemporaryRail: (item: RailData) => void
  updateTemporaryRail: (item: Partial<RailData>) => void
  deleteTemporaryRail: () => void
  setTemporaryRailGroup: (item: RailGroupDataPayload) => void
  updateTemporaryRailGroup: (item: Partial<RailGroupData>) => void
  addRail: (item: RailData, overwrite?: boolean) => void
  addRailGroup: (item: RailGroupData, children: RailData[], overwrite?: boolean) => void
}

export type RailBaseEnhancedProps = RailBaseProps & WithRailBaseProps & WithBuilderPublicProps


/**
 * Railの各種イベントハンドラを提供するHOC
 * 依存: WithBuilder
 */
export default function withRailBase(WrappedComponent: React.ComponentClass<RailBaseProps>) {

  const mapStateToProps = (state: RootState): Partial<WithRailBaseProps> => {
    return {
      temporaryRails: state.builder.temporaryRails,
      temporaryRailGroup: state.builder.temporaryRailGroup,
      activeLayerId: state.builder.activeLayerId,
      nextRailId: nextRailId(state),
      nextRailGroupId: nextRailGroupId(state),
      userRailGroups: state.builder.userRailGroups,
      nextPivotJointIndex: nextPivotJointIndex(state),
      nextPivotJointInfo: nextPivotJointInfo(state),
      intersects: state.builder.intersects,
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

  class WithRailBase extends React.Component<RailBaseEnhancedProps, {}> {

    rail: RailBase<any, any>

    constructor(props: RailBaseEnhancedProps) {
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
      if (this.props.builderGetUserRailGroupData()) {
        this.showTemporaryRailGroup(jointId)
      } else if (this.props.builderGetRailItemData()) {
        this.showTemporaryRail(jointId)
      }
    }


    /**
     * ジョイント上でマウスが動いた場合
     * レールの重なりを検出した場合、ジョイントの表示をエラーにする
     * @param {number} jointId
     * @param {MouseEvent} e
     */
    onJointMouseMove = (jointId: number, e: MouseEvent) => {
      if (this.props.intersects) {
        this.joints[jointId].part.setState({
          isError: true
        })
      } else {
        this.joints[jointId].part.setState({
          isError: false
        })
      }
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
      if (this.props.intersects) {
        // ジョイントの検出状態を変更させない
        return false
      }

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
      const {rails, openJoints} = this.props.builderGetUserRailGroupData()

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
      const railData = this.props.builderGetRailItemData()
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

  return compose<WithRailBaseProps, WithRailBaseProps|any>(
    withBuilder,
    connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})
  )(WithRailBase)
}

