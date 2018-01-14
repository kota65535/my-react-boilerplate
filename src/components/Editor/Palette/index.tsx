import * as React from 'react'
import {Paper, Grid, Checkbox, ListItemText, Tabs, Tab} from 'material-ui'
import {StyledRnd, StyledTab, StyledTabs} from "./styles";
import AppBar from "material-ui/AppBar";
import Builder from "./Builder";
import {Simulator} from "./Simulator";
import BuildIcon from "material-ui-icons/Build"
import PlayIcon from "material-ui-icons/PlayArrow"
import {setPaletteMode} from "../../../actions/tools";
import {connect} from "react-redux";
import {TitleDiv} from "../Layers/styles";
import {Tools} from "../../../constants/tools";

export interface PaletteProps {
  tool: Tools
  setPaletteMode: (mode: string) => void
}

const builderTools = [
  Tools.STRAIGHT_RAILS, Tools.CURVE_RAILS, Tools.TURNOUTS
]


export class Palette extends React.Component<PaletteProps, {}> {

  constructor(props: PaletteProps) {
    super(props)
  }

  handleTabChange = (e: any, mode: string) => {
    this.props.setPaletteMode(mode)
  }

  render() {
    return (
      <StyledRnd
        enableResizing={{}}
        // dragHandleClassName=''
      >
        <Paper>
          {builderTools.includes(this.props.tool) && (
            <Builder title={this.props.tool} />
          )}
          {/*{this.props.mode === 'Simulator' && (*/}
            {/*<Simulator/>*/}
          {/*)}*/}
        </Paper>
      </StyledRnd>
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
    setPaletteMode: (mode: string) => dispatch(setPaletteMode(mode)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Palette)
