import * as React from 'react';
import {RootState} from "store/type";
import {setMousePosition} from "actions/builder";
import {connect} from "react-redux";
import {PaperScope, Path, Point, ToolEvent, View} from 'paper'
import {Rectangle} from "react-paper-bindings";
import getLogger from "logging";
import {getRailDataById, hitTestAll} from "components/hoc/withBuilder";
import {WithHistoryProps, WithHistoryPublicProps} from "components/hoc/withHistory";
import {currentLayoutData} from "selectors";
import {LayoutData, LayoutStoreState} from "reducers/layout";
import * as update from "immutability-helper";

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


type WithSelectToolProps = WithSelectToolPublicProps & WithSelectToolPrivateProps & WithHistoryPublicProps

/**
 * レールの矩形選択機能を提供するHOC。
 * 依存: WithHistory
 */
export default function withSelectTool(WrappedComponent: React.ComponentClass<WithSelectToolPublicProps & WithHistoryPublicProps>) {

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
        // 矩形の内側または重なる図形があれば選択状態にする
        PAPER_SCOPE.project.activeLayer.getItems().forEach(item => {
          if (item.data.partType === 'RailPart') {
            if (item.isInside(this.selectionRect.bounds) || item.intersects(this.selectionRect)) {
              LOGGER.info(item.data.railId)
              const railData = getRailDataById(this.props.layout, item.data.railId)
              this.props.updateItem(railData, update(railData, {
                  selected: { $set: true }
                }
              ), false)
            }
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
