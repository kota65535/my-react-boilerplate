import * as React from 'react'
import {connect} from 'react-redux';
import * as _ from "lodash";
import RailFactory from "../rails/RailFactory";
import {PaletteItem, RootState} from "store/type";
import {LayoutData} from "reducers/layout";
import {currentLayoutData, isLayoutEmpty, nextRailId} from "selectors";
import {HitResult, Point, ToolEvent} from "paper";
import {getClosest} from "constants/utils";
import {addUserRailGroup, deleteTemporaryRail, setMarkerPosition, setPhase, setTemporaryRail} from "actions/builder";
import {TEMPORARY_RAIL_OPACITY} from "constants/tools";
import {BuilderPhase, UserRailGroupData} from "reducers/builder";
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
}


interface WithBuilderPrivateProps {
  layout: LayoutData
  paletteItem: PaletteItem
  activeLayerId: number
  isLayoutEmpty: boolean
  mousePosition: Point
  setTemporaryRail: (item: RailData) => void
  deleteTemporaryRail: () => void
  setPhase: (phase: BuilderPhase) => void
  phase: BuilderPhase
  setMarkerPosition: (position: Point) => void
  markerPosition: Point
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
      phase: state.builder.phase,
      temporaryRails: state.builder.temporaryRails,
      markerPosition: state.builder.markerPosition,
      nextRailId: nextRailId(state)
    }
  }

  const mapDispatchToProps = (dispatch: any) => {
    return {
      setTemporaryRail: (item: RailData) => dispatch(setTemporaryRail(item)),
      deleteTemporaryRail: () => dispatch(deleteTemporaryRail({})),
      setPhase: (phase: BuilderPhase) => dispatch(setPhase(phase)),
      setMarkerPosition: (position: Point) => dispatch(setMarkerPosition(position)),
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

    // /**
    //  * 追加されるキー操作。
    //  * @param {KeyboardEvent} e
    //  */
    // keyDown = (e: KeyboardEvent) => {
    //   switch (e.key) {
    //     case 'ArrowLeft':
    //       this.undo()
    //       break;
    //     case 'ArrowRight':
    //       this.redo()
    //       break;
    //   }
    // }
    //
    // componentDidMount() {
    //   document.addEventListener('keydown', this.keyDown)
    // }
    //
    // componentWillUnmount() {
    //   document.removeEventListener('keydown', this.keyDown)
    // }

    //==================== MouseMove Handlers ====================

    mouseMove = (e: ToolEvent | any) => {
      const methodName = `mouseMove_${this.props.phase}` //`
      if (typeof this[methodName] === 'function') {
        // LOGGER.debug(`EventHandler: ${methodName}`)
        this[methodName](e)
      } else {
        LOGGER.error(`EventHandler: ${methodName} does not exist!`) //`
      }
    }

    mouseMove_Normal = (e: ToolEvent | any) => {
      // noop
    }


    mouseMove_SetAngle = (e: ToolEvent | any) => {
      // マウス位置から一本目レールの角度を算出し、マーカー位置に仮レールを表示させる
      const itemProps = RailFactory[this.props.paletteItem.name]()
      const angle = getFirstRailAngle(this.props.markerPosition, e.point)
      LOGGER.debug(`FirstAngle: ${angle}`) // `
      this.props.setTemporaryRail({
        ...itemProps,
        id: -1,
        name: 'TemporaryRail',
        position: this.props.markerPosition,
        angle: angle,
        opacity: TEMPORARY_RAIL_OPACITY,
        enableJoints: false,
      })
    }


    //==================== MouseDown Handlers ====================

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
      const methodName = `mouseLeftDown_${this.props.phase}`; // `

      if (typeof this[methodName] === 'function') {
        LOGGER.info(`EventHandler: ${methodName}`); // `
        this[methodName](e)
      } else {
        LOGGER.error(`EventHandler: ${methodName} does not exist!`); // `
      }
    }


    mouseLeftDown_Normal = (e: ToolEvent | any) => {
      // this.props.setPhase(BuilderPhase.SET_ANGLE)
      // クリックして即座に仮レールを表示したいので、手動で呼び出す
      // this.mouseMove_FirstAngle(e)
    }


    mouseLeftDown_SetAngle = (e: ToolEvent | any) => {
      // パレットで選択したレール生成のためのPropsを取得
      const itemProps = RailFactory[this.props.paletteItem.name]()
      // 仮レールの位置にレールを設置
      this.props.addRail({
        ...itemProps,
        id: this.props.nextRailId,
        position: this.props.temporaryRails[0].position,
        angle: this.props.temporaryRails[0].angle,
        layerId: this.props.activeLayerId,
        opposingJoints: {}
      } as RailData)
      // 2本目のフェーズに移行する
      this.props.setPhase(BuilderPhase.NORMAL)
      // マーカーはもう不要なので削除
      this.props.deleteTemporaryRail()
      this.props.setMarkerPosition(null)
    }


    removeSelectedRails() {
      const selectedRails = this.props.layout.rails.filter(r => r.selected)
      LOGGER.info(`[Builder] Selected rail IDs: ${selectedRails.map(r => r.id)}`); // `

      selectedRails.forEach(item => {
        this.props.addHistory()
        // this.disconnectJoint(item.id)
        this.props.removeRail(item, true)
      })
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
     * 選択中のレールを新しいレールグループとして登録する
     */
    registerRailGroup() {
      // 選択中のレールコンポーネントのPropsを取得する
      let rails = this.getSelectedRailData()
      let newRails = rails.map((rail, idx) => update(rail, {
        id: {$set: -2-idx},           // 仮のIDを割り当てる
        enableJoints: {$set: false},  // ジョイントは無効にしておく
        selected: {$set: false},      // 選択状態は解除しておく
        railGroup: {$set: -1},        // 仮のレールグループIDを割り当てる
      }))
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


/**
 * 指定の点からマウスカーソルの位置を結ぶ直線の角度をstep刻みで返す。
 * @param {paper.Point} anchor
 * @param {paper.Point} cursor
 * @param {number} step
 * @returns {number}
 */
const getFirstRailAngle = (anchor: Point, cursor: Point, step: number = 45) => {
  const diffX = cursor.x - anchor.x
  const diffY = cursor.y - anchor.y
  const angle = Math.atan2(diffY, diffX) * 180 / Math.PI
  // このやり方では 0~180度の範囲でしか分からない
  // const diff = cursor.subtract(anchor)
  // const unit = new Point(1,0)
  // const angle = Math.acos(unit.dot(diff) / (unit.length * diff.length))
  const candidates = _.range(-180, 180, step)
  return getClosest(angle, candidates)
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

