import * as React from 'react'
import builderPaletteData from "constants/builderPaletteItems.json"
import {Tools} from "constants/tools";
import StraightRailIcon from '../ToolBar/Icon/StraightRail'
import CurveRailIcon from '../ToolBar/Icon/CurveRail'
import TurnoutIcon from "../ToolBar/Icon/Turnout";
import BuilderPalette from "./BuilderPalette"
import Rnd from "react-rnd"
import {UserRailGroupData} from "reducers/builder";


export interface PaletteProps {
  className?: string
  tool: Tools
  setPaletteMode: (mode: string) => void
  userRailGroups: UserRailGroupData[]
}


export default class Palette extends React.Component<PaletteProps, {}> {

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
        <BuilderPalette
          active={this.isActive(Tools.STRAIGHT_RAILS)}
          icon={(<StraightRailIcon/>)}
          title={Tools.STRAIGHT_RAILS}
          items={builderPaletteData[Tools.STRAIGHT_RAILS]}
        />
        <BuilderPalette
          active={this.isActive(Tools.CURVE_RAILS)}
          icon={(<CurveRailIcon/>)}
          title={Tools.CURVE_RAILS}
          items={builderPaletteData[Tools.CURVE_RAILS]}
        />
        <BuilderPalette
          active={this.isActive(Tools.TURNOUTS)}
          icon={(<TurnoutIcon/>)}
          title={Tools.TURNOUTS}
          items={builderPaletteData[Tools.TURNOUTS]}
        />
        <BuilderPalette
          active={this.isActive(Tools.SPECIAL_RAILS)}
          icon={(<TurnoutIcon/>)}
          title={Tools.SPECIAL_RAILS}
          items={builderPaletteData[Tools.SPECIAL_RAILS]}
        />
        <BuilderPalette
          active={this.isActive(Tools.RAIL_GROUPS)}
          icon={(<TurnoutIcon/>)}
          title={Tools.RAIL_GROUPS}
          items={this.props.userRailGroups.map(rg => {
            return {name: rg.name, type: 'RailGroup'}
          })}
        />
      </Rnd>
    )
  }
}

