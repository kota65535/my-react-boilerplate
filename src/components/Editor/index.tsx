import * as React from 'react'
import { compose } from 'recompose'
import pick from 'lodash.pick'

import { Layer, Raster, Tool, View } from 'react-paper-bindings'

import withHistory, {WithHistoryProps} from '../hoc/withHistory'
import withFullscreen, {WithFullscreenProps} from '../hoc/withFullscreen'
import withTools, {WithToolsInjectedProps} from '../hoc/withTools'
import withMoveTool, {WithMoveToolProps} from '../hoc/withMoveTool'

import {EditorBody, StyledPalette, StyledToolBar, StyledWrapper, StretchedView, StyledLayers} from "./styles";
import {GRID_PAPER_HEIGHT, GRID_PAPER_WIDTH, GRID_SIZE, INITIAL_ZOOM, Tools, ZOOM_FACTOR} from "constants/tools";

import './Paper.css'
import GridPaper from "./GridPaper";

import rails from "../Rails";
import {Path, Point, Size} from "paper";
import StraightRail from "../Rails/StraightRail";
import withBuilder, {WithBuilderPublicProps} from "../hoc/withBuilder";
import CurveRail from "../Rails/CurveRail";
import Joint from "../Rails/parts/Joint";
import {RootState} from "store/type";
import {connect} from "react-redux";
import {ItemData, LayoutStoreState} from "reducers/layout";
import {Rectangle} from "react-paper-bindings"


export interface EditorProps {
  layout: LayoutStoreState
  width: number
  height: number
  activeLayer: any
  selectedItem: any
  mousePosition: Point
}

export interface EditorState {
  imageLoaded: boolean
  loaded: boolean
  showLayers: boolean
}

type ComposedEditorProps = EditorProps
  & WithHistoryProps
  & WithFullscreenProps
  & WithToolsInjectedProps
  & WithMoveToolProps
  & WithBuilderPublicProps



class Editor extends React.Component<ComposedEditorProps, EditorState> {

  private _view: View | null;
  private _loaded: boolean;

  constructor(props: ComposedEditorProps) {
    super(props)
    this.state = {
      imageLoaded: false,
      loaded: false,
      showLayers: true,
    }
    this._view = null
  }

  save = () => {
    const json = this._view._scope.project.exportJSON()
    const svg = this._view._scope.project.exportSVG({ embedImages: false })
    console.log(json)
    console.log(svg)
  }

  toggleLayers = () => {
    this.setState({
      showLayers: !this.state.showLayers,
    })
  }

  isActive = (tool: string) => {
    return this.props.activeTool === tool
  }


  render() {
    const {
      activeTool, activeLayer,
      selectedItem
    } = this.props

    const toolbarProps = Object.assign(pick(this.props,
      ['activeTool', 'setTool', 'undo', 'redo', 'canUndo', 'canRedo', 'selectedItem']), {
      save: this.save,
      toggleLayers: this.toggleLayers,
    })

    const layerProps = {
      layers: this.props.layout.layers,
      activeLayer: 1,
    }

    const matrix = pick(this.props, [
      'sx', 'sy', 'tx', 'ty', 'x', 'y', 'zoom',
    ])

    const viewProps = Object.assign(pick(this.props, [
      'activeTool', 'activeLayer', 'width', 'height',
    ]), {
      ref: ref => this._view = ref,
      onWheel: this.props.moveToolMouseWheel,
      matrix: pick(this.props, [
        'sx', 'sy', 'tx', 'ty', 'x', 'y', 'zoom',
      ])
    })

    // データから各レイヤーを生成する
    let layers = this.props.layout.layers.map(layer =>
      <Layer
        data={{id: layer.id}}
        visible={layer.visible}
        key={layer.id}
      >
        {layer.children.map(({id: id, type: type, ...props}: ItemData) => {
          // レールコンポーネントクラスを取得する
          let RailComponent = rails[type]
          console.log(props)
          return (
            <RailComponent
              key={id}
              {...props}
              // data={{ id: id, type: Type }}
                // (activeTool === Tools.SELECT)
                // (this.props.selectedItem.id === selectedItem || layer.id === selectedItem)
            />)
          }
        )}
      </Layer>
    )


    return (

      <StyledWrapper>
        <StyledToolBar {...toolbarProps} />
        <EditorBody>
          <StyledPalette />
          <StyledLayers {...layerProps} />
            {/*<StretchedView width={0} height={0} matrix={{}}>*/}
          <GridPaper
            width={GRID_PAPER_WIDTH}
            height={GRID_PAPER_HEIGHT}
            gridSize={GRID_SIZE}
            onWheel={this.props.moveToolMouseWheel}
            matrix={matrix}
          >
            <Layer>
              {/*<CirclePart*/}
                {/*radius={10}*/}
                {/*position={this.props.mousePosition}*/}
              {/*/>*/}
              <Rectangle
                // point={new Point(300,300)}
                center={this.props.mousePosition}
                fillColor={'orange'}
                size={new Size(100,100)}
              />

            </Layer>
            {layers}
            <Tool
              active={this.isActive(Tools.STRAIGHT_RAILS || Tools.CURVE_RAILS)}
              name={Tools.STRAIGHT_RAILS}
              onMouseDown={this.props.builderMouseDown}
              onMouseMove={(e) => {
                this.props.builderMouseMove(e)
                this.props.moveToolMouseMove(e)
              }}
            />
            <Tool
              active={this.isActive(Tools.PAN)}
              name={Tools.PAN}
              onMouseDown={this.props.moveToolMouseDown}
              onMouseDrag={this.props.moveToolMouseDrag}
              onMouseUp={this.props.moveToolMouseUp}
              onMouseMove={this.props.moveToolMouseMove}
            />
              {/*active={this.isActive(Tools.SELECT)}*/}
              {/*name={Tools.SELECT}*/}
              {/*onKeyDown={this.props.selectToolKeyDown}*/}
              {/*onKeyUp={this.props.selectToolKeyUp}*/}
              {/*onMouseDown={this.props.selectToolMouseDown}*/}
              {/*onMouseDrag={this.props.selectToolMouseDrag}*/}
              {/*onMouseUp={this.props.selectToolMouseUp}*/}
            {/*/>*/}
          </GridPaper>
        </EditorBody>
      </StyledWrapper>
    )
  }

  getNearestGridPosition = (mousePosition) => {
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    layout: state.layout,
    mousePosition: state.builder.mousePosition
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {}
}




export default connect(mapStateToProps, mapDispatchToProps)(compose<EditorProps, EditorProps>(
  withHistory,
  withFullscreen,
  withTools,
  withMoveTool,
  // withStraightRail,
  // withCurveRail
  withBuilder,
)(Editor))
