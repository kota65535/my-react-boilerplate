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

export interface PaletteProps {
  mode: string
  setPaletteMode: (mode: string) => void
}


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
          <AppBar position="static">
            <Tabs
              value={this.props.mode}
              onChange={this.handleTabChange}
              fullWidth
            >
              <StyledTab icon={<BuildIcon />} label="Builder" value="Builder" />
              <StyledTab icon={<PlayIcon />} label="Simulator" value="Simulator" />
            </Tabs>
          </AppBar>
          {this.props.mode === 'Builder' && (
            <Builder />
          )}
          {this.props.mode === 'Simulator' && (
            <Simulator/>
          )}
        </Paper>
      </StyledRnd>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    mode: state.palette.mode
  }
};

const mapDispatchToProps = dispatch => {
  return {
    setPaletteMode: (mode: string) => dispatch(setPaletteMode(mode)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Palette)
