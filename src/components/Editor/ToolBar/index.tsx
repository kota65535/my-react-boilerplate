import * as React from 'react'
import TouchAppIcon from 'material-ui-icons/TouchApp'
import CurveRailIcon from './Icon/CurveRail'
import StraightRailIcon from './Icon/StraightRail'
import TurnoutIcon from './Icon/Turnout'
import AddBoxIcon from 'material-ui-icons/AddBox'
import UndoIcon from 'material-ui-icons/Undo'
import RedoIcon from 'material-ui-icons/Redo'
import {Menu, MenuItem, Toolbar as MuiToolbar} from "material-ui"
import {AppBar} from "material-ui"
import {StyledIconButton, VerticalDivider} from "./styles";


export interface ToolBarProps {
  activeTool: string
  setTool: any
  selectedItem: PaletteItem
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  activateBuilderTool: (type: string) => void
}

export interface ToolBarState {
  open: boolean
  el: HTMLElement | undefined
}

export default class ToolBar extends React.Component<ToolBarProps, ToolBarState> {

  constructor(props: ToolBarProps) {
    super(props)
    this.state = {
      open: false,
      el: undefined
    }

    this.handlePutToolOpen = this.handlePutToolOpen.bind(this)
    this.handlePutToolClose = this.handlePutToolClose.bind(this)
  }

  isActive(tool: string) {
    return this.props.activeTool === tool ? 'active' : ''
  }

  handlePutToolOpen(e: React.MouseEvent<HTMLElement>) {
    this.setState( {
      open: true,
      el: e.currentTarget
    })
  }

  handlePutToolClose(e: React.MouseEvent<HTMLElement>) {
    let value =  e.currentTarget.dataset.value
    if (value) {
      this.props.setTool(value)
    }
    this.setState({open: false})
  }

  render() {
    return (
      <AppBar>
        <MuiToolbar>
          <StyledIconButton
            className={`${this.isActive('Straight Rails')}`}
            onClick={() => this.props.setTool('Straight Rails')}
          >
            <StraightRailIcon/>
          </StyledIconButton>
          <StyledIconButton
            className={`${this.isActive('Curve Rails')}`}
            onClick={() => this.props.setTool('Curve Rails')}
          >
            <CurveRailIcon/>
          </StyledIconButton>
          <StyledIconButton
            className={`${this.isActive('Turnouts')}`}
            onClick={() => this.props.setTool('Turnouts')}
          >
            <TurnoutIcon/>
          </StyledIconButton>
          <VerticalDivider>
          </VerticalDivider>
          {/*<Menu*/}
          {/*open={this.state.open}*/}
          {/*onClose={this.handlePutToolClose}*/}
          {/*anchorEl={this.state.el}*/}
          {/*>*/}
          {/*<MenuItem data-value="rectangle" onClick={this.handlePutToolClose}>Rectangle</MenuItem>*/}
          {/*<MenuItem data-value="circle" onClick={this.handlePutToolClose}>Circle</MenuItem>*/}
          {/*</Menu>*/}

          <StyledIconButton
            className={`IconButton ${this.isActive('undo') && this.props.canUndo}`}
            onClick={this.props.undo}>
            <UndoIcon/>
          </StyledIconButton>
          <StyledIconButton
            className={`IconButton ${this.isActive('redo') && this.props.canRedo}`}
            onClick={() => this.props.redo()}>
            <RedoIcon/>
          </StyledIconButton>
        </MuiToolbar>
      </AppBar>
    )
  }
}

