import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import RectPart from "../rails/parts/primitives/RectPart";
import {RootState} from "store/type";
import {connect} from "react-redux";
import {setMarkerPosition, setPhase} from "actions/builder";
import {BuilderPhase} from "reducers/builder";
import {getClosest} from "constants/utils";
import * as _ from "lodash";
import {SettingsStoreState} from "reducers/settings";


interface FirstRailPutterProps {
  position: Point
  setMarkerPosition: (position: Point) => void
  setPhase: (phase: BuilderPhase) => void
  settings: SettingsStoreState
}

interface FirstRailPutterState {
  fixedPosition: Point
}

const mapStateToProps = (state: RootState) => {
  return {
    position: state.builder.mousePosition,
    settings: state.settings
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
    this.props.setPhase(BuilderPhase.SET_ANGLE)
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
    const {paperWidth, paperHeight, gridSize} = this.props.settings
    const xNums = _.range(0, paperWidth, gridSize);
    const xPos = getClosest(pos.x, xNums)
    const yNums = _.range(0, paperHeight, gridSize);
    const yPos = getClosest(pos.y, yNums)
    return new Point(xPos, yPos)
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(FirstRailPutter)
