import * as React from 'react';
import {RootState} from "store/type";
import {setMousePosition} from "actions/builder";
import {connect} from "react-redux";
import {PaperScope, Group, Path, Point, ToolEvent, View, Item} from 'paper'
import {Rectangle} from "react-paper-bindings";
import getLogger from "logging";
import {hitTestAll, WithBuilderPublicProps} from "components/hoc/withBuilder";
import {WithHistoryProps, WithHistoryPublicProps} from "components/hoc/withHistory";
import {currentLayoutData} from "selectors";
import {LayoutData, LayoutStoreState} from "reducers/layout";
import * as update from "immutability-helper";
import {getRailDataById} from "components/hoc/common";

const LOGGER = getLogger(__filename)


export interface WithSelectToolPublicProps {
  selectToolMouseDown: (e: ToolEvent) => void
  selectToolMouseDrag: (e: ToolEvent) => void
  selectToolMouseUp: (e: ToolEvent) => void
  selectionRectFrom: Point
  selectionRectTo: Point
}

export interface WithSelectToolPrivateProps {
  layout: LayoutData
  setMousePosition: (point: Point) => void
}

interface WithSelectToolState {
  selectionRectFrom: Point
  selectionRectTo: Point
}


type WithSelectToolProps = WithSelectToolPublicProps & WithSelectToolPrivateProps & WithHistoryPublicProps & WithBuilderPublicProps

/**
 * レールの矩形選択機能を提供するHOC。
 * 依存: WithHistory, WithBuilder
 */
export default function withSelectTool(WrappedComponent: React.ComponentClass<WithSelectToolProps>) {

  const mapStateToProps = (state: RootState) => {
    return {
      layout: currentLayoutData(state),
    }
  }

  const mapDispatchToProps = (dispatch: any) => {
    return {
      setMousePosition: (point: Point) => dispatch(setMousePosition(point))
    }
  }

  class WithSelectTool extends React.Component<WithSelectToolProps, WithSelectToolState> {

    selectionRect: Path.Rectangle
    selectionRectFrom: Point

    constructor(props: WithSelectToolProps) {
      super(props)

      this.state = {
        selectionRectFrom: null,
        selectionRectTo: null
      }
      this.selectionRect = null
      this.mouseDrag = this.mouseDrag.bind(this)
      this.mouseDown = this.mouseDown.bind(this)
      this.mouseUp = this.mouseUp.bind(this)
    }


    mouseDown = (e: ToolEvent|any) => {
      // Pathを毎回生成・削除する場合、PaperRendererで描画するよりも
      // 生のPaperJSオブジェクトを操作したほうが都合が良い。
      // 新規矩形選択を開始
      if (! e.modifiers.shift) {
        this.props.builderDeselectAllRails()
      }

      this.selectionRectFrom = e.point
      this.selectionRect = new Path.Rectangle({
          from: this.selectionRectFrom,
          to: e.point,
          fillColor: 'blue',
          opacity: 0.5
        }
      )
    }


    mouseDrag = (e: ToolEvent|any) => {
      if (this.selectionRect) {
        this.selectionRect.remove()
        this.selectionRect = new Path.Rectangle({
            from: this.selectionRectFrom,
            to: e.point,
            fillColor: 'blue',
            opacity: 0.5
          }
        )
      }
    }


    mouseUp = (e: ToolEvent) => {
      if (this.selectionRect) {
        // 選択対象は現在のレイヤーのレールとする
        PAPER_SCOPE.project.activeLayer.getItems().forEach((item: any) => {
          if (!(item instanceof Group && item.data && item.data.type === 'RailPart')) {
            return
          }

          // 矩形がRailPartを構成するPathを含むか、交わっているか確認する
          let result = item.children['main'].children.map(path => {
            let isIntersected = this.selectionRect.intersects(path)
            let isContained = this.selectionRect.contains((path as any).localToOther(this.selectionRect, path.position))
            return isIntersected || isContained
          }).every((e) => e)

          // 上記の条件を満たしていれば選択状態にする
          if (result) {
            LOGGER.info(item.data.railId)
            const railData = getRailDataById(this.props.layout, item.data.railId)
            this.props.builderSelectRail(railData)
          }
        })
        this.selectionRect.remove()
      }
    }


    render() {
      return (
        <WrappedComponent
          {...this.props}
          selectToolMouseDown={this.mouseDown}
          selectToolMouseDrag={this.mouseDrag}
          selectToolMouseUp={this.mouseUp}
          selectionRectFrom={this.state.selectionRectFrom}
          selectionRectTo={this.state.selectionRectTo}
        />
      )
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(WithSelectTool)

}
