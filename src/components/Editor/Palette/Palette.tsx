import * as React from 'react'
import {connect} from "react-redux";
import builderPaletteData from "constants/builderPaletteItems.json"
import {Tools} from "constants/tools";
import StraightRailIcon from '../ToolBar/Icon/StraightRail'
import CurveRailIcon from '../ToolBar/Icon/CurveRail'
import TurnoutIcon from "../ToolBar/Icon/Turnout";
import Builder from "./Builder/Builder"
import Rnd from "react-rnd"
import {RootState} from "store/type";

export interface PaletteProps {
  className?: string
  tool: Tools
  setPaletteMode: (mode: string) => void
}


export class Palette extends React.Component<PaletteProps, {}> {

  constructor(props: PaletteProps) {
    super(props)
  }

  isActive = (tool: string) => {
    return this.props.tool === tool
  }

  render() {

    return (
      <Rnd
        className={this.props.className}
        dragHandleClassName='.Palette__title'
      >
        <Builder
          active={this.isActive(Tools.STRAIGHT_RAILS)}
          icon={(<StraightRailIcon/>)}
          title={Tools.STRAIGHT_RAILS}
          items={builderPaletteData[Tools.STRAIGHT_RAILS]}
        />
        <Builder
          active={this.isActive(Tools.CURVE_RAILS)}
          icon={(<CurveRailIcon/>)}
          title={Tools.CURVE_RAILS}
          items={builderPaletteData[Tools.CURVE_RAILS]}
        />
        <Builder
          active={this.isActive(Tools.TURNOUTS)}
          icon={(<TurnoutIcon/>)}
          title={Tools.TURNOUTS}
          items={builderPaletteData[Tools.TURNOUTS]}
        />
        <Builder
          active={this.isActive(Tools.SPECIAL_RAILS)}
          icon={(<TurnoutIcon/>)}
          title={Tools.SPECIAL_RAILS}
          items={builderPaletteData[Tools.SPECIAL_RAILS]}
        />
      </Rnd>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    tool: state.tools.activeTool
  }
};

const mapDispatchToProps = dispatch => {
  return {
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Palette)
