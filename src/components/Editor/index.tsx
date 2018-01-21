import * as React from 'react'
import { compose } from 'recompose'
import pick from 'lodash.pick'

import { Layer, Raster, Tool, View } from 'react-paper-bindings'

import withHistory, {HistoryData, ItemData, WithHistoryProps} from '../hoc/withHistory'
import withFullscreen, {WithFullscreenProps} from '../hoc/withFullscreen'
import withTools, {WithToolsInjectedProps} from '../hoc/withTools'
import withMoveTool, {WithMoveToolProps} from '../hoc/withMoveTool'
import withSelectTool, {WithSelectToolProps} from '../hoc/withSelectTool'

import {EditorBody, StyledPalette, StyledToolBar, StyledWrapper, StretchedView, StyledLayers} from "./styles";
import {default as withStraightRail, WithStraightRailInjectedProps} from "../hoc/withStraightRail";
import withCurveRail, {WithCurveRailInjectedProps} from "../hoc/withCurveRail";
import {Tools} from "../../constants/tools";

import './Paper.css'
import GridPaper from "./GridPaper";

export interface EditorProps {
  initialData: HistoryData
  width: number
  height: number
  activeLayer: any
  selectedItem: any
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
  & WithSelectToolProps
  & WithStraightRailInjectedProps
  & WithCurveRailInjectedProps


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
      activeTool, activeLayer, data,
      selectedItem
    } = this.props

    const toolbarProps = Object.assign(pick(this.props,
      ['activeTool', 'setTool', 'undo', 'redo', 'canUndo', 'canRedo', 'selectedItem']), {
      save: this.save,
      toggleLayers: this.toggleLayers,
    })

    const layerProps = {
      layers: ['L1', 'L2'],
      activeLayer: 'L2',
      visible: [false, false]
    }


    const viewProps = Object.assign(pick(this.props, [
      'activeTool', 'activeLayer', 'width', 'height',
    ]), {
      ref: ref => this._view = ref,
      onWheel: this.props.moveToolMouseWheel,
      matrix: pick(this.props, [
        'sx', 'sy', 'tx', 'ty', 'x', 'y', 'zoom',
      ])
    })


    let layers = this.props.data.layers.map(layer =>
      <Layer
        data={{id: layer.id}}
        visible={layer.visible}
        key={layer.id}
      >
        {layer.children.map((item: ItemData) => {
          return (
            <item.type
              key={item.id}
              radius={item.radius}
              fillColor={item.fillColor}
              position={item.position}
              // {...props}
              data={{ id: item.id, type: item.type }}
              // selected={(
              //   (activeTool === 'select') &&
              //   (itemId === selectedItem || layer.id === selectedItem)
              // )}
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
          <GridPaper width={600} height={300} gridSize={50} initialZoom={0.7} zoomUnit={0.002}>
            {layers}
            <Tool
              active={this.isActive(Tools.STRAIGHT_RAILS)}
              name={'circle'}
              onMouseDown={this.props.straightRailsMouseDown}
            />
            <Tool
              active={activeTool === Tools.CURVE_RAILS}
              name={Tools.CURVE_RAILS}
              onMouseDown={this.props.straightRailsMouseDown}
            />
          </GridPaper>
        </EditorBody>
      </StyledWrapper>
    )
  }
}

export default compose<EditorProps, EditorProps>(
  withHistory,
  withFullscreen,
  withTools,
  withMoveTool,
  withSelectTool,
  withStraightRail,
  withCurveRail
)(Editor)
