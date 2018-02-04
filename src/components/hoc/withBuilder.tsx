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
      temporaryItem: state.builder.temporaryItem
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

    firstRailPosition: Point

    constructor (props: WithBuilderProps) {
      super(props)

      this.firstRailPosition = null
      this.mouseDown = this.mouseDown.bind(this)
      this.mouseLeftDown = this.mouseLeftDown.bind(this)
      this.mouseRightDown = this.mouseRightDown.bind(this)
      this.mouseMove = this.mouseMove.bind(this)
    }

    // componentDidMount() {
    //   if (this.props.isLayoutEmpty) {
    //     this.state = BuilderState.CHOOSING_FIRST_RAIL_POSITION
    //   } else {
    //     this.state = BuilderState.SECOND_RAIL
    //   }
    // }

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
      // パレットで選択したレール生成のためのPropsを取得
      const itemProps = RailFactory[this.props.selectedItem.name]()

      // 最初の一本目を設置しようとした
      if (this.props.phase === BuilderPhase.CHOOSING_FIRST_RAIL_POSITION) {
        const results = hitTestAll(e.point)
        const firstPositionRect = results.map(r => r.item).find(i => i.name === 'FirstRailPosition')
        if (firstPositionRect) {
          this.firstRailPosition = firstPositionRect.position
          this.props.setPhase(BuilderPhase.CHOOSING_FIRST_RAIL_ANGLE)
        }
      } else if (this.props.phase === BuilderPhase.CHOOSING_FIRST_RAIL_ANGLE) {
        this.props.addItem(this.props.activeLayerId, {
          ...itemProps,
          position: (this.props.temporaryItem as any).position,
          angle: (this.props.temporaryItem as any).angle
        } as ItemData)
        this.props.setPhase(BuilderPhase.SECOND_RAIL)
        this.props.setMarkerPosition(null)
      }

      // else {
      //   // レイヤーにレールを追加
      //   const item = this.props.addItem(this.props.activeLayerId, {
      //       ...itemProps,
      //       position: e.point
      //     } as ItemData)
      // }
    }


    mouseRightDown(e) {

    }


    mouseMove = (e: ToolEvent|any) => {
      let results = hitTestAll(e.point)
      console.log(results)

      if (this.props.phase === BuilderPhase.CHOOSING_FIRST_RAIL_POSITION) {
        this.props.setMarkerPosition(this.getNearestGridPosition(e.point))
      // const items =
      // const target = items.find(item => item.name == 'unko')
      //
      // if (this.isLayoutEmpty()) {
      //
      }
      if (this.props.phase === BuilderPhase.CHOOSING_FIRST_RAIL_ANGLE) {
        const itemProps = RailFactory[this.props.selectedItem.name]()
        const angle = this.getFirstRailAngle(this.firstRailPosition, e.point)
        console.log(angle)
        // this.props.addItem(this.props.activeLayerId, {
        //   ...itemProps,
        //   position: this.firstRailPosition
        // } as ItemData)
        this.props.setTemporaryItem({
          ...itemProps,
          position: this.firstRailPosition,
          angle: angle,
          opacity: TEMPORARY_RAIL_OPACITY
        },)
      }
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
