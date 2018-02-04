import * as React from 'react'
import {connect} from 'react-redux';
import {WithHistoryProps} from "./withHistory";
import * as _ from "lodash";
import RailFactory from "../Rails/RailFactory";
import {PaletteItem, RootState} from "store/type";
import {ItemData, LayoutStoreState} from "reducers/layout";
import HitResult = paper.HitResult;
import Point = paper.Point;
import {isLayoutEmpty} from "selectors";
import ToolEvent = paper.ToolEvent;

export interface WithBuilderPublicProps {
  builderMouseDown: any
  builderMouseMove: any
}

interface WithBuilderPrivateProps {
  layout: LayoutStoreState
  selectedItem: PaletteItem
  activeLayerId: number
  isLayoutEmpty: boolean
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
      isLayoutEmpty: isLayoutEmpty(state)
    }
  }

  const mapDispatchToProps = (dispatch: any) => {
    return {}
  }

  class WithBuilderComponent extends React.Component<WithBuilderProps, {}> {

    isPuttingFisrtRail: boolean

    constructor (props: WithBuilderProps) {
      super(props)

      this.isPuttingFisrtRail = false
      this.mouseDown = this.mouseDown.bind(this)
      this.mouseLeftDown = this.mouseLeftDown.bind(this)
      this.mouseRightDown = this.mouseRightDown.bind(this)
      this.mouseMove = this.mouseMove.bind(this)
    }

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
      // this.props.deselectItem()
      // Paperオブジェクトを取得
      const paper = e.tool._scope
      // パレットで選択したレール生成のためのPropsを取得
      const itemProps = RailFactory[this.props.selectedItem.name]()
      if (this.props.isLayoutEmpty) {
        // 最初の一本目を設置しようとした
        const results = hitTestAll(e.point)
        const firstPositionRect = results.map(r => r.item).find(i => i.name === 'FirstRailPosition')
        if (firstPositionRect) {
          console.log(firstPositionRect)
          this.props.addItem(this.props.activeLayerId, {
            ...itemProps,
            position: firstPositionRect.position
          } as ItemData)
        }
      } else {
        // レイヤーにレールを追加
        const item = this.props.addItem(this.props.activeLayerId, {
            ...itemProps,
            position: e.point
          } as ItemData)
      }
    }


    mouseRightDown(e) {

    }


    mouseMove = (e: ToolEvent|any) => {
      let results = hitTestAll(e.point)
      console.log(results)

      // const items =
      // const target = items.find(item => item.name == 'unko')
      //
      // if (this.isLayoutEmpty()) {
      //
      // }

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
    tolerance: 5
  };
  let hitResults = (paperScope.project as any).hitTestAll(point, hitOptions);
  // Groupがひっかかるとうざいので取り除く
  // let hitResultsPathOnly = hitResults.filter(r => r.item instanceof paper.Path);
  // return hitResultsPathOnly;
  return hitResults;
}
