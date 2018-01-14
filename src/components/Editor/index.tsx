import * as React from 'react'
import { compose } from 'recompose'
import pick from 'lodash.pick'

import { Layer, Raster, Tool, View } from 'react-paper-bindings'

import withHistory, {WithHistoryProps} from '../hoc/withHistory'
import withFullscreen, {WithFullscreenProps} from '../hoc/withFullscreen'
import withTools, {WithToolsInjectedProps} from '../hoc/withTools'
import withMoveTool, {WithMoveToolProps} from '../hoc/withMoveTool'
import withSelectTool, {WithSelectToolProps} from '../hoc/withSelectTool'
import withBuilder, {WithBuilderProps} from '../hoc/withBuilder'

import Layers from './Layers/index';
import {EditorBody, StyledPalette, StyledToolBar, StyledWrapper} from "./styles";
import {default as withStraightRail, WithStraightRailInjectedProps} from "../hoc/withStraightRail";
import withCurveRail from "../hoc/withCurveRail";
import {Tools} from "../../constants/tools";

export interface PaperProps {
  image: any
  imageWidth: number
  imageHeight: number
  imageSize: number
  initialData: any[]
  width: number
  height: number
  setImageSize: any
  activeLayer: any
  selectedItem: any
}

export interface PaperState {
  imageLoaded: boolean
  loaded: boolean
  showLayers: boolean
}

type ComposedPaperProps = PaperProps
  & WithHistoryProps
  & WithFullscreenProps
  & WithToolsInjectedProps
  & WithMoveToolProps
  & WithSelectToolProps
  & WithBuilderProps
  & WithStraightRailInjectedProps


class Paper extends React.Component<ComposedPaperProps, PaperState> {

  private _view: View | null;
  private _loaded: boolean;

  constructor(props: ComposedPaperProps) {
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

  imageLoaded = (image) => {
    this._loaded = true
    this.props.fitImage(image)
    this.setState({ imageLoaded: true, loaded: true })
  }

  componentWillUpdate(nextProps) {
    const { image } = this.props
    if (image !== nextProps.image) {
      this.setState({ imageLoaded: false })
    }
  }

  render() {
    const {
      activeTool, activeLayer, image, data,
      selectedItem, setTool, width, height,
    } = this.props

    const { loaded, imageLoaded, showLayers, } = this.state

    const toolbarProps = Object.assign(pick(this.props,
      ['activeTool', 'setTool', 'undo', 'redo', 'canUndo', 'canRedo', 'selectedItem']), {
      showLayers,
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

      
    return (
      <StyledWrapper>
        <StyledToolBar {...toolbarProps} />
        <EditorBody>
          <StyledPalette />
          {loaded && showLayers &&
          <Layers {...layerProps} />}
          <View {...viewProps}>
            <Layer>
              <Raster locked source={image} onLoad={this.imageLoaded} />
            </Layer>
            {data.map(({ id: layerId, type, children }) =>
              <Layer
                key={layerId}
                data={{ id: layerId, type }}
                visible={imageLoaded}
                active={layerId === activeLayer}>
                {children.map(({ id: itemId, type: Item, ...props }) =>
                  <Item
                    key={itemId}
                    {...props}
                    data={{ id: itemId, type: Item }}
                    selected={(
                      (activeTool === 'select') &&
                      (itemId === selectedItem || layerId === selectedItem)
                    )}
                  />
                )}
              </Layer>
            )}
            <Tool
              active={activeTool === 'select'}
              name={'select'}
              onKeyDown={this.props.selectToolKeyDown}
              onKeyUp={this.props.selectToolKeyUp}
              onMouseDown={this.props.selectToolMouseDown}
              onMouseDrag={this.props.selectToolMouseDrag}
              onMouseUp={this.props.selectToolMouseUp}
            />
            <Tool
              active={activeTool === 'move'}
              name={'move'}
              onMouseDown={this.props.moveToolMouseDown}
              onMouseDrag={this.props.moveToolMouseDrag}
              onMouseUp={this.props.moveToolMouseUp}
            />
            <Tool
              active={activeTool === 'circle'}
              name={'circle'}
              onMouseDown={this.props.builderMouseDown}
            />
            <Tool
              active={activeTool === Tools.STRAIGHT_RAILS}
              name={Tools.STRAIGHT_RAILS}
              onMouseDown={this.props.straightRailsMouseDown}
            />
            <Tool
              active={activeTool === Tools.CURVE_RAILS}
              name={Tools.CURVE_RAILS}
              onMouseDown={this.props.straightRailsMouseDown}
            />
            {/*<Tool*/}
              {/*active={activeTool === TURNOUTS}*/}
              {/*name={TURNOUTS}*/}
              {/*onMouseDown={this.props.turnoutsMouseDown}*/}
            {/*/>*/}
          </View>
        </EditorBody>
      </StyledWrapper>
    )
  }
}

export default compose<PaperProps, PaperProps>(
  withHistory,
  withFullscreen,
  withTools,
  withMoveTool,
  withSelectTool,
  withStraightRail,
  withCurveRail
)(Paper)
