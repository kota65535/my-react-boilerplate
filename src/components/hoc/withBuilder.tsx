import * as React from 'react'
import {connect} from 'react-redux';
import {WithHistoryProps} from "./withHistory";
import * as _ from "lodash";
import RailFactory from "../Rails/RailFactory";
import {PaletteItem, RootState} from "store/type";
import {ItemData, LayoutData, LayoutStoreState} from "reducers/layout";
import {currentLayoutData, isLayoutEmpty} from "selectors";
import {Path, Point, ToolEvent, HitResult} from "paper";
import {getClosest} from "constants/utils";
import {setMarkerPosition, setPhase, setTemporaryItem} from "actions/builder";
import {GRID_PAPER_HEIGHT, GRID_PAPER_WIDTH, GRID_SIZE, TEMPORARY_RAIL_OPACITY} from "constants/tools";
import {BuilderPhase} from "reducers/builder";
import getLogger from "logging";
import * as update from "immutability-helper";
import {DetectionState} from "components/Rails/RailParts/Parts/DetectablePart";

const LOGGER = getLogger(__filename)


export interface WithBuilderPublicProps {
  builderMouseDown: any
  builderMouseMove: any
}

interface WithBuilderPrivateProps {
  layout: LayoutStoreState
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

export type WithBuilderProps = WithBuilderPublicProps & WithBuilderPrivateProps & WithHistoryProps


/**
 * レールを設置する機能を提供するHOC。このアプリの中核機能。
 */
export default function withBuilder(WrappedComponent: React.ComponentClass<WithBuilderProps>) {

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

  class WithBuilderComponent extends React.Component<WithBuilderProps, {}> {

    detecting: any

    constructor (props: WithBuilderProps) {
      super(props)

      this.mouseDown = this.mouseDown.bind(this)
      this.mouseLeftDown = this.mouseLeftDown.bind(this)
      this.mouseRightDown = this.mouseRightDown.bind(this)
      this.mouseMove = this.mouseMove.bind(this)
    }

    // componentDidMount() {
    //   if (this.props.isLayoutEmpty) {
    //     this.state = BuilderState.FIRST_POSITION
    //   } else {
    //     this.state = BuilderState.SUBSEQUENT
    //   }
    // }

    //==================== MouseMove Handlers ====================

    mouseMove = (e: ToolEvent|any) => {
      const methodName = `mouseMove_${this.props.phase}`
      if (typeof this[methodName] === 'function') {
        LOGGER.debug(`EventHandler: ${methodName}`)
        this[methodName](e)
      } else {
        LOGGER.error(`EventHandler: ${methodName} does not exist!`)
      }
    }

    mouseMove_FirstPosition = (e: ToolEvent|any) => {
      // noop
    }


    mouseMove_FirstAngle = (e: ToolEvent|any) => {
      // マウス位置から一本目レールの角度を算出し、マーカー位置に仮レールを表示させる
      const itemProps = RailFactory[this.props.selectedItem.name]()
      const angle = getFirstRailAngle(this.props.markerPosition, e.point)
      LOGGER.info(`FirstAngle: ${angle}`)
      this.props.setTemporaryItem({
        ...itemProps,
        id: -1,
        name: 'TemporaryRail',
        position: this.props.markerPosition,
        angle: angle,
        opacity: TEMPORARY_RAIL_OPACITY,
      })
    }

    mouseMove_Subsequent = (e: ToolEvent|any) => {
      // const result = getRailPartAt(e.point)
      // if (result) {
      //   switch (result.partType) {
      //     case 'Joint':
      //       this.mouseMove_Subsequent_OnJoint(e, result.railId, result.partId)
      //       break
      //     default:
      //   }
      // } else {
      //   if (this.detecting) {
      //     const newItem = update(this.detecting, {
      //       detectionState: {$set: Array(this.detecting.detectionState.length).fill(DetectionState.BEFORE_DETECT)}
      //     })
      //     this.props.updateItem(this.detecting, newItem as any)
      //   }
      //   this.props.setTemporaryItem(null);
      // }
    }


    mouseMove_Subsequent_OnJoint = (e: ToolEvent|any, railId: number, jointId: number) => {
      // 対象のレールのジョイントをDetectingにする
      // const railData = getRailDataById(this.props.layout, railId)
      // const joint = RAIL_COMPONENTS[railId].joints[jointId]
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
      const methodName = `mouseLeftDown_${this.props.phase}`

      if (typeof this[methodName] === 'function') {
        LOGGER.info(`EventHandler: ${methodName}`)
        this[methodName](e)
      } else {
        LOGGER.error(`EventHandler: ${methodName} does not exist!`)
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
        hasOpposingJoints: [false, false]
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


    mouseRightDown(e: ToolEvent|any) {
      // noop
    }


    setJointState = (item: ItemData, jointId: number, detectionState: DetectionState) => {
      const newItem = update(item, {
        detectionState: {$splice: [[jointId, 1, detectionState]]}
      })
      this.props.updateItem(item, newItem)
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          builderMouseDown={this.mouseDown}
          builderMouseMove={this.mouseMove}
        />
      )
    }


  }


  return connect(mapStateToProps, mapDispatchToProps)(WithBuilderComponent)
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
  let hitResults = (paperScope.project as any).hitTestAll(point, hitOptions);
  // Groupがひっかかるとうざいので取り除く
  // let hitResultsPathOnly = hitResults.filter(r => r.item.data.type === "Path");
  // return hitResultsPathOnly;
  return hitResults;
}


const getRailDataById = (layout: LayoutData, id: number) => {
  let found = _.flatMap(layout.layers, layer => layer.children)
    .find(item => item.id === id)
  return found
}


const getFirstRailAngle = (anchor: Point, cursor: Point) => {
  const diffX = cursor.x - anchor.x
  const diffY = cursor.y - anchor.y
  const angle = Math.atan2(diffY, diffX) * 180 / Math.PI
  // このやり方では 0~180度の範囲でしか分からない
  // const diff = cursor.subtract(anchor)
  // const unit = new Point(1,0)
  // const angle = Math.acos(unit.dot(diff) / (unit.length * diff.length))
  const candidates =_.range(-180, 180, 45)
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

