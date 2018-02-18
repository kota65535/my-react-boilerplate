import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import RectPart from "../Rails/RailParts/Parts/RectPart";
import {RootState} from "store/type";
import {connect} from "react-redux";
import {setMarkerPosition, setPhase} from "actions/builder";
import {BuilderPhase} from "reducers/builder";
import {GRID_PAPER_HEIGHT, GRID_PAPER_WIDTH, GRID_SIZE} from "constants/tools";
import {getClosest} from "constants/utils";
import * as _ from "lodash";


interface FirstRailPutterProps {
  position: Point
  setMarkerPosition: (position: Point) => void
  setPhase: (phase: BuilderPhase) => void
}

interface FirstRailPutterState {
  fixedPosition: Point
}

const mapStateToProps = (state: RootState) => {
  return {
    position: state.builder.mousePosition
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    setMarkerPosition: (position: Point) => dispatch(setMarkerPosition(position)),
    setPhase: (phase: BuilderPhase) => dispatch(setPhase(phase)),
  }
}


export class FirstRailPutter extends React.Component<FirstRailPutterProps, FirstRailPutterState> {

  constructor(props: FirstRailPutterProps) {
    super(props)
    this.state = {
      fixedPosition: null
    }

    this.onClick = this.onClick.bind(this)
  }

  onClick = (e: MouseEvent) => {
    const position = this.getNearestGridPosition(this.props.position)
    this.props.setMarkerPosition(position)
    this.props.setPhase(BuilderPhase.FIRST_ANGLE)
    this.setState({
      fixedPosition: position
    })
  }

  render() {
    let position
    if (this.state.fixedPosition) {
      position = this.state.fixedPosition
    } else {
      position = this.getNearestGridPosition(this.props.position)
    }

    return (
      <RectPart
        width={70}
        height={70}
        position={position}
        fillColor={'orange'}
        opacity={0.5}
        onClick={this.onClick}
      />
    )
  }

  getNearestGridPosition = (pos) => {
    const xNums = _.range(0, GRID_PAPER_WIDTH, GRID_SIZE);
    const xPos = getClosest(pos.x, xNums)
    const yNums = _.range(0, GRID_PAPER_HEIGHT, GRID_SIZE);
    const yPos = getClosest(pos.y, yNums)
    return new Point(xPos, yPos)
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(FirstRailPutter)
