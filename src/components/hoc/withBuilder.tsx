import * as React from 'react'
import {connect} from 'react-redux';
import {WithHistoryProps, WithHistoryPublicProps} from "./withHistory";
import * as _ from "lodash";
import RailFactory from "../Rails/RailFactory";
import {PaletteItem, RootState} from "store/type";
import {ItemData, LayoutData, LayoutStoreState} from "reducers/layout";
import {currentLayoutData, isLayoutEmpty} from "selectors";
import {HitResult, Point, ToolEvent} from "paper";
import {getClosest} from "constants/utils";
import {setMarkerPosition, setPhase, setTemporaryItem} from "actions/builder";
import {TEMPORARY_RAIL_OPACITY} from "constants/tools";
import {BuilderPhase} from "reducers/builder";
import getLogger from "logging";
import update from "immutability-helper";
import {DetectionState} from "components/Rails/RailParts/Parts/DetectablePart";
import {RailComponentClasses} from "components/Rails";
import {getAllRails, getRailDataById} from "components/hoc/common";
import Combinatorics from "js-combinatorics"

const LOGGER = getLogger(__filename)


export interface WithBuilderPublicProps {
  builderMouseDown: any
  builderMouseMove: any
  builderKeyDown: any
  builderConnectJoint: (fromRail: ItemData, fromJoint: number, toRail: ItemData, toJoint: number) => void
  builderDisconnectJoint: (railData: ItemData) => void
  builderSelectRail: (railData: ItemData) => void
  builderDeselectRail: (railData: ItemData) => void
  builderDeselectAllRails: () => void
}


interface WithBuilderPrivateProps {
  layout: LayoutData
  selectedItem: PaletteItem
  activeLayerId: number
  isLayoutEmpty: boolean
  mousePosition: Point
  setTemporaryItem: (item: ItemData) => void
  setPhase: (phase: BuilderPhase) => void
  phase: BuilderPhase
  setMarkerPosition: (position: Point) => void
  markerPosition: Point
  temporaryItem: ItemData
}

export type WithBuilderProps = WithBuilderPublicProps & WithBuilderPrivateProps & WithHistoryPublicProps


/**
 * レールの設置に関連する機能を提供するHOC。
 * 依存: WithHistory
 */
export default function withBuilder(WrappedComponent: React.ComponentClass<WithBuilderPublicProps & WithHistoryPublicProps>) {

  const mapStateToProps = (state: RootState) => {
    return {
      layout: currentLayoutData(state),
      selectedItem: state.builder.selectedItem,
      activeLayerId: state.builder.activeLayerId,
      isLayoutEmpty: isLayoutEmpty(state),
      mousePosition: state.builder.mousePosition,
      phase: state.builder.phase,
      temporaryItem: state.builder.temporaryItem,
      markerPosition: state.builder.markerPosition
    }
  }

  const mapDispatchToProps = (dispatch: any) => {
    return {
      setTemporaryItem: (item: ItemData) => dispatch(setTemporaryItem(item)),
      setPhase: (phase: BuilderPhase) => dispatch(setPhase(phase)),
      setMarkerPosition: (position: Point) => dispatch(setMarkerPosition(position))
    }
  }

  class WithBuilder extends React.Component<WithBuilderProps, {}> {

    constructor (props: WithBuilderProps) {
      super(props)

      this.mouseDown = this.mouseDown.bind(this)
      this.mouseLeftDown = this.mouseLeftDown.bind(this)
      this.mouseRightDown = this.mouseRightDown.bind(this)
      this.mouseMove = this.mouseMove.bind(this)
      this.keyDown = this.keyDown.bind(this)
      this.connectJoint = this.connectJoint.bind(this)
      this.disconnectJoint = this.disconnectJoint.bind(this)
      this.selectRail = this.selectRail.bind(this)
      this.deselectRail = this.deselectRail.bind(this)

      }


    //==================== MouseMove Handlers ====================

    mouseMove = (e: ToolEvent|any) => {
      const methodName = `mouseMove_${this.props.phase}` //`
      if (typeof this[methodName] === 'function') {
        // LOGGER.debug(`EventHandler: ${methodName}`)
        this[methodName](e)
      } else {
        LOGGER.error(`EventHandler: ${methodName} does not exist!`) //`
      }
    }

    mouseMove_FirstPosition = (e: ToolEvent|any) => {
      // noop
    }


    mouseMove_FirstAngle = (e: ToolEvent|any) => {
      // マウス位置から一本目レールの角度を算出し、マーカー位置に仮レールを表示させる
      const itemProps = RailFactory[this.props.selectedItem.name]()
      const angle = getFirstRailAngle(this.props.markerPosition, e.point)
      LOGGER.debug(`FirstAngle: ${angle}`) // `
      this.props.setTemporaryItem({
        ...itemProps,
        id: -1,
        name: 'TemporaryRail',
        position: this.props.markerPosition,
        angle: angle,
        opacity: TEMPORARY_RAIL_OPACITY,
        enableJoints: false,
      })
    }

    mouseMove_Subsequent = (e: ToolEvent|any) => {
      // const combinations = Combinatorics.combination(_.flatMap(window.RAIL_COMPONENTS, rc => rc.joints), 2)
      // let closePairs = []
      // combinations.forEach(cmb => {
      //   if (cmb[0].props.position.isClode(cmb[1].props.position, 0.1)) {
      //     closePairs.push(cmb)
      //   }
      // })
      //
      // if (closePairs.length > 0) {
      //
      // }

    }


    // private _isReasonablyClose(point1, point2) {
    //   return point1.isClose(point2, 0.1)
    // }

    mouseMove_Subsequent_OnJoint = (e: ToolEvent|any, railId: number, jointId: number) => {
      // 対象のレールのジョイントをDetectingにする
      // const railData = getRailDataById(this.props.layout, railId)
      // const joint = window.RAIL_COMPONENTS[railId].joints[jointId]
      // if (joint.props.detectionState === DetectionState.AFTER_DETECT) {
      //   return
      // }
      // this.setJointState(railData, jointId, DetectionState.DETECTING)
      //
      //
      // // 現在Detectingにしているジョイントを覚えておく
      // this.detecting = railData
      //
      // // 仮レールを設置する
      // const itemProps = RailFactory[this.props.selectedItem.name]()
      // this.props.setTemporaryItem({
      //   ...itemProps,
      //   id: -1,
      //   name: 'TemporaryRail',
      //   position: joint.position,
      //   angle: joint.props.angle,
      //   opacity: TEMPORARY_RAIL_OPACITY,
      // })
    }

    // resetAllJoints = () => {
    //   let newLayout = _.cloneDeep(this.props.layout)
    //   for (let layer of newLayout.layers) {
    //     for (let item of layer.children) {
    //       if (item.detectionState === DetectionState.DETECTING) {
    //
    //       }
    //     }
    //   }
    // }


    //==================== MouseDown Handlers ====================

    mouseDown(e: ToolEvent|any) {
      switch (e.event.button) {
        case 0:
          this.mouseLeftDown(e)
          break
        case 2:
          this.mouseRightDown(e)
          break
      }
    }


    mouseLeftDown(e: ToolEvent|any) {
      const methodName = `mouseLeftDown_${this.props.phase}`; // `

      if (typeof this[methodName] === 'function') {
        LOGGER.info(`EventHandler: ${methodName}`); // `
        this[methodName](e)
      } else {
        LOGGER.error(`EventHandler: ${methodName} does not exist!`); // `
      }
    }


    mouseLeftDown_FirstPosition = (e: ToolEvent|any) => {
      // this.props.setPhase(BuilderPhase.FIRST_ANGLE)
      // クリックして即座に仮レールを表示したいので、手動で呼び出す
      // this.mouseMove_FirstAngle(e)
    }


    mouseLeftDown_FirstAngle  = (e: ToolEvent|any) => {
      // パレットで選択したレール生成のためのPropsを取得
      const itemProps = RailFactory[this.props.selectedItem.name]()
      // 仮レールの位置にレールを設置
      this.props.addItem(this.props.activeLayerId, {
        ...itemProps,
        position: (this.props.temporaryItem as any).position,
        angle: (this.props.temporaryItem as any).angle,
        layerId: this.props.activeLayerId,
        opposingJoints: new Array(RailComponentClasses[itemProps.type].NUM_JOINTS).fill(null)
      } as ItemData)
      // 2本目のフェーズに移行する
      this.props.setPhase(BuilderPhase.SUBSEQUENT)
      // マーカーはもう不要なので削除
      this.props.setTemporaryItem(null)
      this.props.setMarkerPosition(null)
    }


    mouseLeftDown_Subsequent = (e: ToolEvent|any) => {
      const result = getRailPartAt(e.point)
      if (result) {
        switch (result.partType) {
          case 'Joint':
            this.mouseLeftDown_Subsequent_OnJoint(e, result.railId, result.partId)
            break
          default:
        }
      } else {
        // noop
      }
    }


    mouseLeftDown_Subsequent_OnJoint = (e: ToolEvent|any, railId: number, jointId: number) => {
      // 対象のレールのジョイントをAfterDetectにする
      // const oldItem = getRailDataById(this.props.layout, railId)
      // this.setJointState(oldItem, jointId, DetectionState.AFTER_DETECT)
      //
      // // パレットで選択したレール生成のためのPropsを取得
      // const itemProps = RailFactory[this.props.selectedItem.name]()
      // // 仮レールの位置にレールを設置
      // this.props.addItem(this.props.activeLayerId, {
      //   ...itemProps,
      //   position: (this.props.temporaryItem as any).position,
      //   angle: (this.props.temporaryItem as any).angle,
      //   detectionState: [DetectionState.AFTER_DETECT, DetectionState.BEFORE_DETECT],
      //   layerId: this.props.activeLayerId,
      // } as ItemData)
      // this.detecting = null

    }


    removeSelectedRails() {
      const selectedRails = _.flatMap(this.props.layout.layers, layer => layer.children)
        .filter(item => item.selected)
      LOGGER.info(`[Builder] Selected rail IDs: ${selectedRails.map(r => r.id)}`); // `

      selectedRails.forEach(item => {
        this.disconnectJoint(item)
        this.props.removeItem(item)
      })
    }


    mouseRightDown(e: ToolEvent|any) {
      // noop
    }

    keyDown(e: ToolEvent|any) {
      switch (e.key) {
        case 'backspace':
          LOGGER.info('backspape pressed');
          this.removeSelectedRails()
          break
        case 'c':
          break
      }
    }

    /**
     * 指定のレールのジョイント接続を解除する。
     * @param {ItemData} railData
     */
    disconnectJoint = (railData: ItemData) => {
      railData.opposingJoints.forEach(joint => {
        if (joint) {
          const railData = getRailDataById(this.props.layout, joint.railId)
          if (railData) {
            this.props.updateItem(railData, update(railData, {
              opposingJoints: {
                [joint.jointId]: {$set: null}
              }
            }), false)
          }
        }
      })
    }

    /**
     * ２つのレール同士のジョイントを接続する。
     * @param {ItemData} fromRail
     * @param {number} fromJoint
     * @param {ItemData} toRail
     * @param {number} toJoint
     */
    connectJoint = (fromRail: ItemData, fromJoint: number, toRail: ItemData, toJoint: number) => {
      this.props.updateItem(fromRail, update(fromRail, {
          opposingJoints: {
            [fromJoint]: {$set: {
                railId: toRail.id,
                jointId: toJoint
              }
            }
          }
        }
      ), false)
      this.props.updateItem(toRail, update(toRail, {
          opposingJoints: {
            [toJoint]: {$set: {
                railId: fromRail.id,
                jointId: fromJoint
              }
            }
          }
        }
      ), false)
    }

    /**
     * レールを選択する。
     * @param {ItemData} railData
     */
    selectRail = (railData: ItemData) => {
      LOGGER.info(`selectRail: ${railData.id}`) //`
      this.props.updateItem(railData, update(railData, {
          selected: { $set: true }
        }
      ), false)
    }

    /**
     * レールの選択を解除する。
     * @param {ItemData} railData
     */
    deselectRail = (railData: ItemData) => {
      LOGGER.info(`deselectRail: ${railData.id}`) //`
      this.props.updateItem(railData, update(railData, {
          selected: { $set: false }
        }
      ), false)
    }

    /**
     * レールの選択を解除する。
     * @param {ItemData} railData
     */
    deselectAllRails = () => {
      LOGGER.info(`deselectAllRails`) //`
      getAllRails(this.props.layout).forEach(railData => {
        this.props.updateItem(railData, update(railData, {
            selected: { $set: false }
          }
        ), false)
      })
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          builderMouseDown={this.mouseDown}
          builderMouseMove={this.mouseMove}
          builderKeyDown={this.keyDown}
          builderConnectJoint={this.connectJoint}
          builderDisconnectJoint={this.disconnectJoint}
          builderSelectRail={this.selectRail}
          builderDeselectRail={this.deselectRail}
          builderDeselectAllRails={this.deselectAllRails}
        />
      )
    }
  }

  return connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(WithBuilder)
}



export const hitTestAll = (point: Point): HitResult[] => {
  let hitOptions :any = {
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
  const candidates =_.range(-180, 180, step)
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

