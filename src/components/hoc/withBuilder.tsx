import * as React from 'react'
import {connect} from 'react-redux';
import {PaletteItem, RootState} from "store/type";
import {LayoutData} from "reducers/layout";
import {currentLayoutData, isLayoutEmpty, nextRailId} from "selectors";
import {HitResult, Point, ToolEvent} from "paper";
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

const LOGGER = getLogger(__filename)


export interface WithBuilderPublicProps {
  builderMouseDown: any
  builderMouseMove: any
  builderKeyDown: any
  builderConnectJoints: (pairs: JointPair[]) => void
  builderDisconnectJoint: (railId: number) => void
  builderChangeJointState: (pairs: JointPair[], state: DetectionState) => void
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
  mousePosition: Point
  setTemporaryRail: (item: RailData) => void
  deleteTemporaryRail: () => void
  nextRailId: number
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
      mousePosition: state.builder.mousePosition,
      temporaryRails: state.builder.temporaryRails,
      nextRailId: nextRailId(state)
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

  class WithBuilder extends React.Component<WithBuilderProps, {}> {

    constructor(props: WithBuilderProps) {
      super(props)

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
          this.registerRailGroup()
          this.deselectAllRails()
          break
      }
    }

    /**
     * 選択中のレールを削除する。
     */
    removeSelectedRails() {
      const selectedRails = this.props.layout.rails.filter(r => r.selected)
      LOGGER.info(`[Builder] Selected rail IDs: ${selectedRails.map(r => r.id)}`); // `

      selectedRails.forEach(item => {
        this.props.addHistory()
        // this.disconnectJoint(item.id)
        this.props.removeRail(item, true)
      })
    }


    /**
     * 選択中のレールを新しいレールグループとして登録する
     */
    registerRailGroup() {
      // 選択中のレールコンポーネントのPropsを取得する
      const rails = this.getSelectedRailData()
      const railIds = rails.map(r => r.id)

      // 空いているジョイントを探す
      // レールグループ内のレール以外に繋がっているジョイントも空きジョイントとする
      const openJoints = []
      let newRails = rails.map((rail, idx) => {
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
      // TODO: 名前をどうする？
      const railGroup: UserRailGroupData = {
        type: 'RailGroup',
        rails: newRails,
        id: -1,
        layerId: -10,
        name: 'aaaaa',
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
      // 指定のレールが接続されている対向レールのジョイントを解除する
      const connectedJoints = getRailComponent(railId).props.opposingJoints
      Object.values(connectedJoints).forEach((joint: JointInfo) => {
        this.props.updateRail({
          id: joint.railId,
          opposingJoints: {
            [joint.jointId]: null
          }
        }, true)
      })
      this.props.updateRail({
        id: railId,
        opposingJoints: {}
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


    changeJointState = (pairs: JointPair[], state: DetectionState) => {
      pairs.forEach(pair => {
        LOGGER.info(`change joint state`, pair) //`
        const rail = getRailComponent(pair.to.railId)
        const part = rail.joints[pair.to.jointId].part
        if (part.state.detectionState !== state) {
          part.setState({
            detectionState: state,
            detectionPartVisible: true
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
      )
    }
  }

  return connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(WithBuilder)
}


export const hitTestAll = (point: Point): HitResult[] => {
  let hitOptions: any = {
    // class: Path,
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 0,
    // match: (result: HitResult) => {
    //   return result.item instanceof Path
    // },


  };
  let hitResults = (window.PAPER_SCOPE.project as any).hitTestAll(point, hitOptions);
  // Groupがひっかかるとうざいので取り除く
  // let hitResultsPathOnly = hitResults.filter(r => r.item.data.type === "Path");
  // return hitResultsPathOnly;
  return hitResults;
}



const getRailPartAt = (point: Point) => {
  const results = hitTestAll(point)
  const item = results.map(r => r.item).find(i => i.name === "Rail")
  if (item) {
    return item.data
  } else {
    return null
  }
}

