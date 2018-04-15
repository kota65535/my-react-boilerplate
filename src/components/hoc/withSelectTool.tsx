import * as React from 'react';
import {RootState} from "store/type";
import {setMousePosition} from "actions/builder";
import {connect} from "react-redux";
import {Path, Point, ToolEvent} from 'paper'
import {Rectangle} from "react-paper-bindings";
import getLogger from "logging";
import {WithBuilderPublicProps} from "components/hoc/withBuilder";
import {currentLayoutData} from "selectors";
import {LayoutData} from "reducers/layout";
import {DEFAULT_SELECTION_RECT_COLOR, DEFAULT_SELECTION_RECT_OPACITY} from "constants/tools";
import {getAllRailComponents} from "components/rails/utils";

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
  activeLayerId: number
  setMousePosition: (point: Point) => void
}

interface WithSelectToolState {
  selectionRectFrom: Point
  selectionRectTo: Point
}


type WithSelectToolProps = WithSelectToolPublicProps & WithSelectToolPrivateProps & WithBuilderPublicProps

/**
 * レールの矩形選択機能を提供するHOC。
 * 依存: WithHistory, WithBuilder
 */
export default function withSelectTool(WrappedComponent: React.ComponentClass<WithSelectToolProps>) {

  const mapStateToProps = (state: RootState) => {
    return {
      layout: currentLayoutData(state),
      activeLayerId: state.builder.activeLayerId,
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


    /**
     * 任意の地点を左クリックしたら、矩形選択を開始する。
     * @param {paper.ToolEvent | any} e
     */
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
          fillColor: DEFAULT_SELECTION_RECT_COLOR,
          opacity: DEFAULT_SELECTION_RECT_OPACITY,
        }
      )
    }


    /**
     * ドラッグ中は、矩形選択の開始地点からマウスカーソルに至る矩形を表示し続ける。
     * @param {paper.ToolEvent | any} e
     */
    mouseDrag = (e: ToolEvent|any) => {
      if (this.selectionRect) {
        this.selectionRect.remove()
        this.selectionRect = new Path.Rectangle({
            from: this.selectionRectFrom,
            to: e.point,
            fillColor: DEFAULT_SELECTION_RECT_COLOR,
            opacity: DEFAULT_SELECTION_RECT_OPACITY,
          }
        )
      }
    }


    /**
     * ドラッグを終了したら、一部または全体が矩形に含まれるレールを選択状態にする。
     * @param {paper.ToolEvent} e
     */
    mouseUp = (e: ToolEvent) => {
      if (this.selectionRect) {
        // 選択対象は現在のレイヤーのレールとする
        const rails = getAllRailComponents().filter(rc => rc.props.layerId === this.props.activeLayerId)

        rails.forEach((rail: any) => {
          // 矩形がRailPartを構成するPathを含むか、交わっているか確認する
          const targetPaths = rail.railPart.path.children
          let result = targetPaths.map(path => {
            let isIntersected = this.selectionRect.intersects(path)
            let isContained = this.selectionRect.contains((path as any).localToOther(this.selectionRect, path.position))
            return isIntersected || isContained
          }).every((e) => e)

          // 上記の条件を満たしていれば選択状態にする
          if (result) {
            LOGGER.info('selected', rail.props.id)
            this.props.builderSelectRail(rail.props.id)
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
