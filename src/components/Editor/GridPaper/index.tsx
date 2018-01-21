import * as React from 'react'

import { Line, Path, Layer, Raster, Tool, View } from 'react-paper-bindings'
import {Point, Size} from 'paper';
import * as paper from 'paper';
import {StretchedView} from "./styles";
import {ReactDOM, ReactNode} from "react";
import * as _ from "lodash";

export interface GridPaperProps {
  width: number
  height: number
  gridSize: number
  initialZoom: number
  zoomUnit: number
}

const BOARD_WIDTH = 6000;     // ボード幅
const BOARD_HEIGHT = 4000;    // ボード高さ
const GRID_SIZE = 70;
const INITIAL_ZOOM = 0.7;
const ZOOM_UNIT = 0.002;
const AVAILABLE_ZOOM_MIN = 0.2;
const AVAILABLE_ZOOM_MAX = 5;

export default class GridPaper extends React.Component<GridPaperProps, {}> {

  cursorPoint: Point
  cursorDelta: Point
  canvasPoint: Point
  viewCenterMin: Point
  viewCenterMax: Point
  initialViewSize: Size
  boardMin: Point
  boardMax: Point
  shouldModifyViewCenter: boolean
  matrix: object
  view: any
  mounted: boolean

  constructor(props: GridPaperProps) {
    super(props)
    // this.state = {
    //   imageLoaded: false,
    //   loaded: false,
    //   showLayers: true,
    // }
    this.boardMin = new Point(0, 0)
    this.boardMax = new Point(0, 0)
    this.matrix = {
      sx: 0, // scale center x
      sy: 0, // scale center y
      tx: 0, // translate x
      ty: 0, // translate y
      x: 0,
      y: 0,
      zoom: 1,
    }
    this.mounted = false
  }


  resizePaper = () => {
    // this.forceUpdate()
  }

  componentDidMount() {
    this.setState({ mounted: true })
    window.addEventListener('resize', this.resizePaper)
    this.mounted = true
  }

  componentWillUnmount() {
    // cancelAnimationFrame(this._request)
    window.removeEventListener('resize', this.resizePaper)
  }

  // componentDidMount () {
  //   this.forceUpdate()
  //
  //   // this.viewCenterMin = new paper.Point(this.props.width - this.props.width / 2, this.view.size.height - this.props.height / 2);
  //   // this.viewCenterMax = new paper.Point(this.props.width / 2, this.props.height / 2);
  //   // this.boardMin = new paper.Point(this.view.size.width / 2 - this.props.width / 2, this.view.size.height / 2 - this.props.height / 2);
  //   // this.boardMax = new paper.Point(this.view.size.width / 2 + this.props.width / 2, this.view.size.height / 2 + this.props.height / 2);
  // }




  componentDidUpdate () {
    console.log(this.view.paper.view)
  }

  render() {

    // 縦のグリッドを生成
    let verticalLines = _.range(screen.width / this.props.gridSize).map(i => {
      return (
        <Line
          from={new Point(this.props.gridSize * i, 0)}
          to={new Point(this.props.gridSize * i,screen.height)}
          strokeColor={'red'}
        />)
    })
    // 横のグリッドを生成
    let horizontalLines = _.range(screen.height / this.props.gridSize).map(i => {
      return (
        <Line
          from={new Point(0, this.props.gridSize * i)}
          to={new Point(screen.width,this.props.gridSize * i)}
          strokeColor={'red'}
        />)
    })


    return (
        <View width={screen.width} height={screen.height} matrix={this.matrix}
                       ref={(view) => this.view = view}
        >
          <Layer>
            {verticalLines}
            {horizontalLines}
          </Layer>
          {this.props.children}
        </View>
    )
  }
}

