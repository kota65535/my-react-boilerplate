import * as React from 'react'

import {Layer, Line, Path, Raster, Tool, View} from 'react-paper-bindings'
import {Point} from 'paper';
import * as _ from "lodash";
import {RootState} from "store/type";
import {setPaperViewLoaded} from "actions/builder";
import {connect} from "react-redux";

export interface GridPaperProps {
  width: number
  height: number
  gridSize: number
  onWheel: any
  matrix: any
  setPaperViewLoaded: (loaded: boolean) => void
}

const mapStateToProps = (state: RootState) => {
  return {
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    setPaperViewLoaded: (view: View) => dispatch(setPaperViewLoaded(view))
  }
}



export class GridPaper extends React.Component<GridPaperProps, {}> {

  boardMin: Point
  boardMax: Point
  matrix: object
  view: View|any
  mounted: boolean

  constructor(props: GridPaperProps) {
    super(props)
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
    window.PAPER_SCOPE = this.view.paper
    this.props.setPaperViewLoaded(true)
  }

  componentWillUnmount() {
    // cancelAnimationFrame(this._request)
    window.removeEventListener('resize', this.resizePaper)
  }


  render() {

    // 縦のグリッドを生成
    let verticalLines = _.range(this.props.width / this.props.gridSize).map(i => {
      return (
        <Line
          from={new Point(this.props.gridSize * i, 0)}
          to={new Point(this.props.gridSize * i, this.props.height)}
          strokeColor={i % 10 === 0 ? 'white' : 'red'}
        />)
    })
    // 横のグリッドを生成
    let horizontalLines = _.range(this.props.height / this.props.gridSize).map(i => {
      return (
        <Line
          from={new Point(0, this.props.gridSize * i)}
          to={new Point(this.props.width,this.props.gridSize * i)}
          strokeColor={i % 10 === 0 ? 'white' : 'red'}
        />)
    })


    return (
        <View width={this.props.width}
              height={this.props.height}
              matrix={this.props.matrix}
              onWheel={this.props.onWheel}
              settings={{
                applyMatrix: false
              }}
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

export default connect(mapStateToProps, mapDispatchToProps)(GridPaper)
