import * as React from 'react'
import {connect} from 'react-redux';
import {WithHistoryProps} from "./withHistory";
import * as _ from "lodash";
import RailFactory from "../Rails/RailFactory";
import {PaletteItem, RootState} from "store/type";
import {ItemData, LayoutStoreState} from "reducers/layout";
import {isLayoutEmpty} from "selectors";
import {Path, Point, ToolEvent, HitResult} from "paper";
import {getClosest} from "constants/utils";
import {setMarkerPosition, setPhase, setTemporaryItem} from "actions/builder";
import {GRID_PAPER_HEIGHT, GRID_PAPER_WIDTH, GRID_SIZE, TEMPORARY_RAIL_OPACITY} from "constants/tools";
import {BuilderPhase} from "reducers/builder";
import getLogger from "logging";
import {DetectionState} from "components/Rails/parts/primitives/DetectablePart";
import * as update from "immutability-helper";

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
      layout: state.layout,
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
      // マウス位置に応じてマーカーの位置を決定する
      this.props.setMarkerPosition(this.getNearestGridPosition(e.point))
    }


    mouseMove_FirstAngle = (e: ToolEvent|any) => {
      // 一本目レールの角度を算出し、マーカー位置に仮レールを表示させる
      const itemProps = RailFactory[this.props.selectedItem.name]()
      const angle = this.getFirstRailAngle(this.props.markerPosition, e.point)
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
      const results = hitTestAll(e.point)
      const item = results.map(r => r.item)
        .find(i => i.name && i.name.match(/\d-[sc]-[pj]-\d/).length > 0)
      if (item) {
        const [, railId, railType, partType, partId] = item.name.match(/(\d)-([sc])-([pj])-(\d)/)
        switch (partType) {
          case 'j':
            this.mouseMove_Subsequent_OnJoint(e, Number(railId), Number(partId))
            break
          default:
        }
      } else {
        if (this.detecting) {
          const newItem = update(this.detecting, {
            detectionState: {$set: Array(this.detecting.detectionState.length).fill(DetectionState.BEFORE_DETECT)}
          })
          this.props.updateItem(this.detecting, newItem as any)
        }
        this.props.setTemporaryItem(null);
      }

    }


    mouseMove_Subsequent_OnJoint = (e: ToolEvent|any, railId: number, jointId: number) => {
      // 対象のレールのジョイントをDetectingにする
      const oldItem = findItemFromLayout(this.props.layout, railId)
      const newItem = update(oldItem, {
        detectionState: {$splice: [[jointId, 1, DetectionState.DETECTING]]}
      })
      this.props.updateItem(oldItem, newItem)

      const joint = railComponents[railId].joints[jointId]

      // 現在Detectingにしているジョイントを覚えておく
      this.detecting = oldItem

      // 仮レールを設置する
      const itemProps = RailFactory[this.props.selectedItem.name]()
      this.props.setTemporaryItem({
        ...itemProps,
        id: -1,
        name: 'TemporaryRail',
        position: joint.detectablePart.mainPart.path.position,
        angle: joint.props.angle,
        opacity: TEMPORARY_RAIL_OPACITY,
      })
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
      this.props.setPhase(BuilderPhase.FIRST_ANGLE)
      // クリックして即座に仮レールを表示したいので、手動で呼び出す
      this.mouseMove_FirstAngle(e)
    }


    mouseLeftDown_FirstAngle  = (e: ToolEvent|any) => {
      // パレットで選択したレール生成のためのPropsを取得
      const itemProps = RailFactory[this.props.selectedItem.name]()
      // 仮レールの位置にレールを設置
      this.props.addItem(this.props.activeLayerId, {
        ...itemProps,
        position: (this.props.temporaryItem as any).position,
        angle: (this.props.temporaryItem as any).angle,
        detectionState: [DetectionState.BEFORE_DETECT, DetectionState.BEFORE_DETECT],
        layerId: this.props.activeLayerId,
      } as ItemData)
      // 2本目のフェーズに移行する
      this.props.setPhase(BuilderPhase.SUBSEQUENT)
      // マーカーはもう不要なので削除
      this.props.setTemporaryItem(null)
      this.props.setMarkerPosition(null)
    }


    mouseLeftDown_Subsequent = (e: ToolEvent|any) => {
      const results = hitTestAll(e.point)
      const joint = results.map(r => r.item)
        .find(i => i.name && i.name.match(/\d-[sc]-j-\d/).length > 0)
      const [, railId, jointId] = joint.name.match(/(\d)-[sc]-j-(\d)/)
      const oldItem = findItemFromLayout(this.props.layout, Number(railId))
      const newItem = update(oldItem, {
        detectionState: {$splice: [[jointId, 1, DetectionState.DETECTING]]}
      })
      this.props.updateItem(oldItem, newItem)
      // LOGGER.info("Updated Item")
      // LOGGER.info(oldItem)
      // LOGGER.info(oldItem)
    }



    mouseRightDown(e) {

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


    getFirstRailAngle = (anchor: Point, cursor: Point) => {
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

    getNearestGridPosition = (pos) => {
      const xNums = _.range(0, GRID_PAPER_WIDTH, GRID_SIZE);
      const xPos = xNums.reduce(function(prev, curr) {
        return (Math.abs(curr - pos.x) < Math.abs(prev - pos.x) ? curr : prev);
      });
      const yNums = _.range(0, GRID_PAPER_HEIGHT, GRID_SIZE);
      const yPos = yNums.reduce(function(prev, curr) {
        return (Math.abs(curr - pos.y) < Math.abs(prev - pos.y) ? curr : prev);
      });
      return new Point(xPos, yPos)
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
    tolerance: 5
  };
  let hitResults = (paperScope.project as any).hitTestAll(point, hitOptions);
  // Groupがひっかかるとうざいので取り除く
  // let hitResultsPathOnly = hitResults.filter(r => r.item instanceof paper.Path);
  // return hitResultsPathOnly;
  return hitResults;
}

export const isJoint = (path: Path) =>  path.name.split('-')[2] === 'j'


const findItemFromLayout = (layout: LayoutStoreState, id: number) => {
  let found = _.flatMap(layout.layers, layer => layer.children)
    .find(item => item.id === id)
  return found
}
