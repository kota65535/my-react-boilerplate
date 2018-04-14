import * as React from 'react'
import {connect} from 'react-redux';
import {PaletteItem, RootState} from "store/type";
import {LayoutData} from "reducers/layout";
import {currentLayoutData, isLayoutEmpty, nextRailGroupId, nextRailId} from "selectors";
import {Point, ToolEvent} from "paper";
import {addUserRailGroup, deleteTemporaryRail, setTemporaryRail} from "actions/builder";
import {UserRailGroupData} from "reducers/builder";
import getLogger from "logging";
import update from "immutability-helper";
import {RailData} from "components/rails";
import {addHistory, addRail, removeRail, updateRail} from "actions/layout";
import {JointInfo} from "components/rails/RailBase";
import {getAllRailComponents, getRailComponent} from "components/rails/utils";
import RailGroup from "components/rails/RailGroup/RailGroup";
import {DetectionState} from "components/rails/parts/primitives/DetectablePart";
import NewRailGroupDialog from "components/hoc/NewRailGroupDialog/NewRailGroupDialog";

const LOGGER = getLogger(__filename)


export interface WithBuilderPublicProps {
  builderMouseDown: any
  builderMouseMove: any
  builderKeyDown: any
  builderConnectJoints: (pairs: JointPair[]) => void
  builderDisconnectJoint: (railId: number) => void
  builderChangeJointState: (pairs: JointPair[], state: DetectionState, isError?: boolean) => void
  builderSelectRail: (railData: RailData) => void
  builderDeselectRail: (railData: RailData) => void
  builderToggleRail:  (railData: RailData) => void
  builderDeselectAllRails: () => void
  builderRemoveSelectedRails: () => void
  builderAddRail: () => void
}


interface WithBuilderPrivateProps {
  layout: LayoutData
  paletteItem: PaletteItem
  activeLayerId: number
  isLayoutEmpty: boolean
  setTemporaryRail: (item: RailData) => void
  deleteTemporaryRail: () => void
  nextRailId: number
  nextRailGroupId: number
  temporaryRails: RailData[]
  addRail: (item: RailData, overwrite?: boolean) => void
  updateRail: (item: Partial<RailData>, overwrite?: boolean) => void
  removeRail: (item: RailData, overwrite?: boolean) => void
  addHistory: () => void
  addUserRailGroup: (railGroup: UserRailGroupData) => void
}

export type WithBuilderProps = WithBuilderPublicProps & WithBuilderPrivateProps


export interface JointPair {
  from: JointInfo
  to: JointInfo
}


export interface WithBuilderState {
  newRailGroupDialogOpen: boolean
}


/**
 * レールの設置に関連する機能を提供するHOC。
 * 依存: WithHistory
 */
export default function withBuilder(WrappedComponent: React.ComponentClass<WithBuilderPublicProps>) {

  const mapStateToProps = (state: RootState) => {
    return {
      layout: currentLayoutData(state),
      paletteItem: state.builder.paletteItem,
      activeLayerId: state.builder.activeLayerId,
      isLayoutEmpty: isLayoutEmpty(state),
      temporaryRails: state.builder.temporaryRails,
      nextRailId: nextRailId(state),
      nextRailGroupId: nextRailGroupId(state),
    }
  }

  const mapDispatchToProps = (dispatch: any) => {
    return {
      setTemporaryRail: (item: RailData) => dispatch(setTemporaryRail(item)),
      deleteTemporaryRail: () => dispatch(deleteTemporaryRail({})),
      addRail: (item: RailData, overwrite = false) => dispatch(addRail({item, overwrite})),
      updateRail: (item: Partial<RailData>, overwrite = false) => dispatch(updateRail({item, overwrite})),
      removeRail: (item: RailData, overwrite = false) => dispatch(removeRail({item, overwrite})),
      addHistory: () => dispatch(addHistory({})),
      addUserRailGroup: (railGroup: UserRailGroupData) => dispatch(addUserRailGroup(railGroup))
    }
  }

  class WithBuilder extends React.Component<WithBuilderProps, WithBuilderState> {

    constructor(props: WithBuilderProps) {
      super(props)

      this.state = {
        newRailGroupDialogOpen: false
      }

      this.mouseDown = this.mouseDown.bind(this)
      this.mouseLeftDown = this.mouseLeftDown.bind(this)
      this.mouseRightDown = this.mouseRightDown.bind(this)
      this.mouseMove = this.mouseMove.bind(this)
      this.keyDown = this.keyDown.bind(this)
      this.connectJoints = this.connectJoints.bind(this)
      this.disconnectJoint = this.disconnectJoint.bind(this)
      this.selectRail = this.selectRail.bind(this)
      this.deselectRail = this.deselectRail.bind(this)
      this.toggleRail = this.toggleRail.bind(this)
      this.removeSelectedRails = this.removeSelectedRails.bind(this)
    }

    // componentDidMount() {
    //   document.addEventListener('keydown', this.keyDown)
    // }
    //
    // componentWillUnmount() {
    //   document.removeEventListener('keydown', this.keyDown)
    // }

    mouseMove = (e: ToolEvent | any) => {
      // noop
    }

    mouseDown(e: ToolEvent | any) {
      switch (e.event.button) {
        case 0:
          this.mouseLeftDown(e)
          break
        case 2:
          this.mouseRightDown(e)
          break
      }
    }

    mouseLeftDown(e: ToolEvent | any) {
      // noop
    }

    mouseRightDown(e: ToolEvent | any) {
      // noop
    }


    keyDown(e: ToolEvent | any) {
      switch (e.key) {
        case 'backspace':
          LOGGER.info('backspape pressed');
          this.removeSelectedRails()
          break
        case 'c':
          this.setState({
            newRailGroupDialogOpen: true
          })
          break
      }
    }

    onNewRailGroupDialogClose = () => {
      this.setState({
        newRailGroupDialogOpen: false
      })
    }

    onNewRailGroupDialogOK = (name: string) => {
      this.registerRailGroup(name)
      this.deselectAllRails()
    }


    /**
     * 選択中のレールを削除する。
     */
    removeSelectedRails() {
      const selectedRails = this.props.layout.rails.filter(r => r.selected)
      LOGGER.info(`[Builder] Selected rail IDs: ${selectedRails.map(r => r.id)}`); // `

      selectedRails.forEach(item => {
        this.props.addHistory()
        this.disconnectJoint(item.id)
        this.props.removeRail(item, true)
      })
    }


    /**
     * 選択中のレールを新しいレールグループとして登録する
     */
    registerRailGroup(name: string) {
      // 選択中のレールコンポーネントのPropsを取得する
      const selectedRails = this.getSelectedRailData()
      // 空いているジョイントを探す
      // レールグループ内のレール以外に繋がっているジョイントも空きジョイントとする
      const openJoints = []
      let newRails = selectedRails.map((rail, idx) => {
        const opposingJointIds = _.keys(rail.opposingJoints).map(k => parseInt(k))
        const openJointIds = _.without(_.range(rail.numJoints), ...opposingJointIds)
        openJointIds.forEach(id => openJoints.push({
          railId: idx,
          jointId: id
        }))
        return update(rail, {
          id: {$set: -2-idx},           // 仮のIDを割り当てる
          enableJoints: {$set: false},  // ジョイントは無効にしておく
          selected: {$set: false},      // 選択状態は解除しておく
          railGroup: {$set: -1},        // 仮のレールグループIDを割り当てる
        })
      })

      // レールグループデータを生成する
      const railGroup: UserRailGroupData = {
        type: 'RailGroup',
        rails: newRails,
        id: this.props.nextRailGroupId,
        name: name,
        position: new Point(0, 0),
        angle: 0,
        openJoints: openJoints
      }
      this.props.addUserRailGroup(railGroup)
    }


    getSelectedRailData() {
      return getAllRailComponents()
        .filter(rail => rail.props.selected)
        .map(rail => rail.props)
    }


    /**
     * 指定のレールのジョイント接続を解除する。
     */
    disconnectJoint = (railId: number) => {
      const targetRail = this.props.layout.rails.find(r => r.id === railId)
      if (targetRail == null) {
        return
      }
      // 指定のレールに接続されている全てのレールのジョイントを解除する
      const connectedJoints = targetRail.opposingJoints
      _.values(connectedJoints).forEach((joint: JointInfo) => {
        this.props.updateRail({
          id: joint.railId,
          opposingJoints: {
            [joint.jointId]: null
          }
        }, true)
      })
      // 指定のレールのジョイントを解除する
      this.props.updateRail({
        id: railId,
        opposingJoints: null
      }, true)
    }

    /**
     * レール同士のジョイントを接続する。
     * 複数指定可能。特に同一レールの複数ジョイントを接続する場合は一度の呼び出しで実行すること
     */
    connectJoints = (pairs: JointPair[]) => {
      pairs.forEach(pair => {
        LOGGER.info(`connect Joints`, pair) //`
        this.props.updateRail({
          id: pair.from.railId,
          opposingJoints: {
            [pair.from.jointId]: pair.to
          }
        }, true)
        this.props.updateRail({
          id: pair.to.railId,
          opposingJoints: {
            [pair.to.jointId]: pair.from
          }
        }, true)
      })
    }


    changeJointState = (pairs: JointPair[], state: DetectionState, isError = false) => {
      pairs.forEach(pair => {
        LOGGER.info(`change joint state`, pair) //`
        const rail = getRailComponent(pair.to.railId)
        const part = rail.joints[pair.to.jointId].part
        if (part.state.detectionState !== state) {
          part.setState({
            detectionState: state,
            detectionPartVisible: true,
            isError: isError,
          })
        }
      })
    }


    /**
     * レールを選択する。
     * @param {RailData} railData
     */
    selectRail = (railData: RailData) => {
      this.props.updateRail(update(railData, {
          selected: {$set: true}
        }
      ), true)
    }

    /**
     * レールを選択する。
     * @param {RailData} railData
     */
    toggleRail = (railData: RailData) => {
      this.props.updateRail(update(railData, {
          selected: {$set: ! railData.selected}
        }
      ), true)
    }

    /**
     * レールの選択を解除する。
     * @param {RailData} railData
     */
    deselectRail = (railData: RailData) => {
      this.props.updateRail(update(railData, {
          selected: {$set: false}
        }
      ), true)
    }

    /**
     * 全てのレールの選択を解除する。
     */
    deselectAllRails = () => {
      this.props.layout.rails.forEach(railData => {
        this.props.updateRail(update(railData, {
            selected: {$set: false}
          }
        ), true)
      })
    }

    render() {
      return (
        <React.Fragment>
          <WrappedComponent
            {...this.props}
            builderMouseDown={this.mouseDown}
            builderMouseMove={this.mouseMove}
            builderKeyDown={this.keyDown}
            // builderAddRail={this.addRail}
            builderConnectJoints={this.connectJoints}
            builderDisconnectJoint={this.disconnectJoint}
            builderChangeJointState={this.changeJointState}
            builderSelectRail={this.selectRail}
            builderDeselectRail={this.deselectRail}
            builderToggleRail={this.toggleRail}
            builderDeselectAllRails={this.deselectAllRails}
            builderRemoveSelectedRails={this.removeSelectedRails}
          />
          <NewRailGroupDialog
            title={'New Rail Group'}
            okButtonTitle={'OK'}
            open={this.state.newRailGroupDialogOpen}
            onClose={this.onNewRailGroupDialogClose}
            onOK={this.onNewRailGroupDialogOK}
          />
        </React.Fragment>
      )
    }
  }

  return connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(WithBuilder)
}


