import * as React from 'react'
import { compose } from 'recompose'
import pick from 'lodash.pick'

import { Layer, Raster, Tool, View } from 'react-paper-bindings'

import withHistory, {WithHistoryProps} from '../hoc/withHistory'
import withFullscreen, {WithFullscreenProps} from '../hoc/withFullscreen'
import withTools, {WithToolsInjectedProps} from '../hoc/withTools'
import withMoveTool, {WithMoveToolProps} from '../hoc/withMoveTool'

import {EditorBody, StyledPalette, StyledToolBar, StyledWrapper, StretchedView, StyledLayers} from "./Editor.style";
import {
  GRID_PAPER_HEIGHT, GRID_PAPER_WIDTH, GRID_SIZE,
  Tools
} from "constants/tools";

import './Paper.css'
import GridPaper from "./GridPaper/GridPaper";

import rails from "../Rails";
import {Path, Point, Size} from "paper";
import withBuilder, {WithBuilderPublicProps} from "../hoc/withBuilder";
import {RootState} from "store/type";
import {connect} from "react-redux";
import {ItemData, LayoutStoreState} from "reducers/layout";
import {Rectangle} from "react-paper-bindings"
import {isLayoutEmpty} from "selectors";
import {BuilderPhase} from "reducers/builder";
import getLogger from "logging";

const LOGGER = getLogger(__filename)


export interface EditorProps {
  layout: LayoutStoreState
  width: number
  height: number
  selectedItem: any
  mousePosition: Point
  isLayoutEmpty: boolean
  temporaryItem: ItemData
  builderPhase: BuilderPhase
  markerPosition: Point
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


const mapStateToProps = (state: RootState) => {
  return {
    layout: state.layout,
    mousePosition: state.builder.mousePosition,
    isLayoutEmpty: isLayoutEmpty(state),
    temporaryItem: state.builder.temporaryItem,
    builderPhase: state.builder.phase,
    markerPosition: state.builder.markerPosition
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {}
}


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

    const toolbarProps = Object.assign(pick(this.props,
      ['activeTool', 'setTool', 'undo', 'redo', 'canUndo', 'canRedo', 'selectedItem', 'resetViewPosition']), {
      save: this.save,
      toggleLayers: this.toggleLayers,
    })

    const layerProps = {
      layers: this.props.layout.layers,
    }

    const matrix = pick(this.props, [
      'sx', 'sy', 'tx', 'ty', 'x', 'y', 'zoom',
    ])

    const viewProps = Object.assign(pick(this.props, [
      'width', 'height',
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
        {layer.children.map(item => this.createRailComponent(item))}
      </Layer>
    )



    return (

      <StyledWrapper>
        <StyledToolBar {...toolbarProps} />
        <EditorBody>
          <StyledPalette />
          <StyledLayers {...layerProps} />
          <GridPaper
            width={GRID_PAPER_WIDTH}
            height={GRID_PAPER_HEIGHT}
            gridSize={GRID_SIZE}
            onWheel={this.props.moveToolMouseWheel}
            matrix={matrix}
          >
            <Layer
              key={-1}
              data={{id: -1}}
            >
              {this.props.markerPosition &&
              <Rectangle
                center={this.props.markerPosition}
                fillColor={'orange'}
                size={new Size(GRID_SIZE,GRID_SIZE)}
                opacity={0.5}
                name={'FirstRailPosition'}
              />
              }
              {this.props.temporaryItem &&
              this.createRailComponent(this.props.temporaryItem)}
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


  createRailComponent = (item: ItemData) => {
    const {id: id, type: type, ...props} = item
    let RailComponent = rails[type]
    // LOGGER.debug(props)
    return (
      <RailComponent
        key={id}
        id={id}
        {...props}
        // data={{ id: id, type: Type }}
        // (activeTool === Tools.SELECT)
        // (this.props.selectedItem.id === selectedItem || layer.id === selectedItem)
        ref={(c) => RAIL_COMPONENTS[id] = c}
      />)
  }


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
