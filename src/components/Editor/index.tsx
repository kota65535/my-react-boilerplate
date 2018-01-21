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

import rails from "../Rails";
import DetectablePart, {DetectionState} from "../Rails/parts/primitives/DetectablePart";
import {Point} from "paper";
import RectPart, {AnchorPoint} from '../Rails/parts/primitives/RectPart';
import StraightRailPart, {RailPartAnchor} from '../Rails/StraightRailPart';
import TrianglePart from "../Rails/parts/primitives/TrianglePart";


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


    // データから各レイヤーを生成する
    let layers = this.props.data.layers.map(layer =>
      <Layer
        data={{id: layer.id}}
        visible={layer.visible}
        key={layer.id}
      >
        {layer.children.map(({id: id, type: type, ...props}: ItemData) => {
          // 動的にレールコンポーネントを取得する
          let RailComponent = rails[type]
          return (
            <RailComponent
              key={id}
              {...props}
              // data={{ id: id, type: Type }}
              selected={true}
                // (activeTool === Tools.SELECT)
                // (this.props.selectedItem.id === selectedItem || layer.id === selectedItem)
            />)
          }
        )}

        <DetectablePart
          position={new Point(100,100)}
          angle={45}
          width={100}
          height={100}
          widthMargin={50}
          heightMargin={50}
          fillColors={['blue', 'red', 'green']}
          opacities={[0.5, 0.5, 0]}
          detectionState={DetectionState.DETECTING}
          anchor={AnchorPoint.LEFT}
        />

        <StraightRailPart
          position={new Point(200,100)}
          angle={30}
          length={100}
          detectionState={DetectionState.DETECTING}
          anchor={RailPartAnchor.START}
        />

        <RectPart
          position={new Point(200,200)}
          angle={45}
          width={100}
          height={100}
          fillColor={'blue'}
          opacity={0.4}
          anchor={AnchorPoint.LEFT}
        />
        <RectPart
          position={new Point(200,200)}
          angle={45}
          width={100}
          height={100}
          fillColor={'blue'}
          opacity={0.4}
          anchor={AnchorPoint.LEFT}
        />
        <TrianglePart
          position={new Point(400,400)}
          angle={0}
          width={100}
          height={100}
          fillColor={'blue'}
          opacity={0.4}
          anchor={AnchorPoint.BOTTOM}
        />








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
              name={Tools.STRAIGHT_RAILS}
              onMouseDown={this.props.straightRailsMouseDown}
            />
            <Tool
              active={this.isActive(Tools.CURVE_RAILS)}
              name={Tools.CURVE_RAILS}
              onMouseDown={this.props.curveRailMouseDown}
            />
            <Tool
              active={this.isActive(Tools.SELECT)}
              name={Tools.SELECT}
              onKeyDown={this.props.selectToolKeyDown}
              onKeyUp={this.props.selectToolKeyUp}
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

export default compose<EditorProps, EditorProps>(
  withHistory,
  withFullscreen,
  withTools,
  withMoveTool,
  withSelectTool,
  withStraightRail,
  withCurveRail
)(Editor)
