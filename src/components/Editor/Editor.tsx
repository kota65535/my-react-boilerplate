import * as React from 'react'
import {compose} from 'recompose'
import pick from 'lodash.pick'

import {Layer, Raster, Rectangle, Tool, View} from 'react-paper-bindings'

import withFullscreen, {WithFullscreenProps} from '../hoc/withFullscreen'
import withTools, {WithToolsPrivateProps} from '../hoc/withTools'
import withMoveTool, {WithMoveToolProps} from '../hoc/withMoveTool'

import {EditorBody, StyledLayers, StyledPalette, StyledToolBar, StyledWrapper} from "./Editor.style";
import {GRID_PAPER_HEIGHT, GRID_PAPER_WIDTH, GRID_SIZE, Tools} from "constants/tools";

import './Paper.css'
import GridPaper from "./GridPaper/GridPaper";

import {Point} from "paper";
import withBuilder, {WithBuilderPublicProps} from "../hoc/withBuilder";
import {RootState} from "store/type";
import {connect} from "react-redux";
import {LayoutData} from "reducers/layout";
import {currentLayoutData, isLayoutEmpty} from "selectors";
import {BuilderPhase} from "reducers/builder";
import getLogger from "logging";
import FirstRailPutter from "./FirstRailPutter";
import {createRailComponent} from "components/rails/utils";
import TemporaryLayer from "components/Editor/TemporaryLayer/TemporaryLayer";
import {default as withDeleteTool, WithDeleteToolProps} from "components/hoc/withDeleteTool";
import withSelectTool, {WithSelectToolPublicProps} from "components/hoc/withSelectTool";

const LOGGER = getLogger(__filename)


export interface EditorProps {
  layout: LayoutData
  width: number
  height: number
  mousePosition: Point
  isLayoutEmpty: boolean
  builderPhase: BuilderPhase
  markerPosition: Point
}

export interface EditorState {
  imageLoaded: boolean
  loaded: boolean
  showLayers: boolean
}

type ComposedEditorProps = EditorProps
  & WithFullscreenProps
  & WithToolsPrivateProps
  & WithMoveToolProps
  & WithBuilderPublicProps
  & WithDeleteToolProps
  & WithSelectToolPublicProps


const mapStateToProps = (state: RootState) => {
  return {
    layout: currentLayoutData(state),
    mousePosition: state.builder.mousePosition,
    isLayoutEmpty: isLayoutEmpty(state),
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

  isActive = (... tools: string[]) => {
    return tools.includes(this.props.activeTool)
  }


  render() {

    const toolbarProps = Object.assign(pick(this.props,
      ['activeTool', 'setTool', 'undo', 'redo', 'canUndo', 'canRedo', 'paletteItem', 'resetViewPosition']), {
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
        data={layer}
        visible={layer.visible}
        key={layer.id}
      >
        {this.props.layout.rails
          .filter(r => r.layerId === layer.id)
          .map(item => createRailComponent(item))}
      </Layer>
    )


    // LOGGER.debug(this.props.mousePosition)
    // LOGGER.debug(`from=${this.props.selectionRectFrom}, to=${this.props.selectionRectTo}`)

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
            {this.props.isLayoutEmpty &&
            <FirstRailPutter
            />
            }
            <TemporaryLayer />

            {layers}

            {/*<StraightRailContainer*/}
              {/*position={new Point(700, 700)}*/}
              {/*pivotJointIndex={1}*/}
              {/*angle={30}*/}
              {/*length={140}*/}
              {/*id={1}*/}
              {/*layerId={1}*/}
            {/*/>*/}

            <Tool
              active={this.isActive(Tools.STRAIGHT_RAILS, Tools.CURVE_RAILS, Tools.TURNOUTS)}
              name={Tools.STRAIGHT_RAILS}
              onMouseDown={this.props.builderMouseDown}
              onMouseMove={(e) => {
                this.props.builderMouseMove(e)
                this.props.moveToolMouseMove(e)
              }}
              onKeyDown={this.props.builderKeyDown}
            />
            <Tool
              active={this.isActive(Tools.DELETE)}
              name={Tools.DELETE}
              onMouseDown={this.props.deleteToolMouseDown}
            />
            <Tool
              active={this.isActive(Tools.PAN)}
              name={Tools.PAN}
              onMouseDown={this.props.moveToolMouseDown}
              onMouseDrag={this.props.moveToolMouseDrag}
              onMouseUp={this.props.moveToolMouseUp}
              onMouseMove={this.props.moveToolMouseMove}
            />
            <Tool
              active={this.isActive(Tools.SELECT)}
              name={Tools.SELECT}
              onMouseDown={this.props.selectToolMouseDown}
              onMouseDrag={this.props.selectToolMouseDrag}
              onMouseUp={this.props.selectToolMouseUp}
            />
          </GridPaper>
        </EditorBody>
      </StyledWrapper>
    )
  }

}




export default connect(mapStateToProps, mapDispatchToProps)(compose<EditorProps, EditorProps>(
  withBuilder,
  withFullscreen,
  withTools,
  withMoveTool,
  // withStraightRail,
  // withCurveRail
  withDeleteTool,
  withSelectTool
)(Editor))
