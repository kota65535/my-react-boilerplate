import * as React from 'react'
import CurveRailIcon from './Icon/CurveRail'
import StraightRailIcon from './Icon/StraightRail'
import TurnoutIcon from './Icon/Turnout'
import UndoIcon from 'material-ui-icons/Undo'
import RedoIcon from 'material-ui-icons/Redo'
import {Menu, MenuItem, Toolbar as MuiToolbar} from "material-ui"
import {AppBar} from "material-ui"
import {StyledIconButton, VerticalDivider} from "./styles";
import {Tools} from "../../../constants/tools";
import {selectItem} from "../../../actions/tools";
import {connect} from "react-redux";


export interface ToolBarProps {
  activeTool: string
  setTool: any
  selectItem: (item: PaletteItem) => void
  lastSelectedItems: object
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

export interface ToolBarState {
  open: boolean
  el: HTMLElement | undefined
}

export class ToolBar extends React.Component<ToolBarProps, ToolBarState> {

  constructor(props: ToolBarProps) {
    super(props)
    this.state = {
      open: false,
      el: undefined
    }
  }

  isActive(tool: string) {
    return this.props.activeTool === tool ? 'active' : ''
  }

  handleBuilderToolsClick = (tool: string, e: MouseEvent) => {
    this.props.setTool(tool)
    // 最後に選択していたアイテムを選択する
    this.props.selectItem({type: tool, name: this.props.lastSelectedItems[tool].name})
  }

  render() {
    return (
      <AppBar>
        <MuiToolbar>
          <StyledIconButton
            className={`${this.isActive('Straight Rails')}`}
            onClick={this.handleBuilderToolsClick.bind(this, Tools.STRAIGHT_RAILS)}
          >
            <StraightRailIcon/>
          </StyledIconButton>
          <StyledIconButton
            className={`${this.isActive('Curve Rails')}`}
            onClick={this.handleBuilderToolsClick.bind(this, Tools.CURVE_RAILS)}
          >
            <CurveRailIcon/>
          </StyledIconButton>
          <StyledIconButton
            className={`${this.isActive('Turnouts')}`}
            onClick={this.handleBuilderToolsClick.bind(this, Tools.TURNOUTS)}
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

const mapStateToProps = (state: RootState) => {
  return {
    lastSelectedItems: state.builder.lastSelectedItems
  }
};

const mapDispatchToProps = dispatch => {
  return {
    selectItem: (item: PaletteItem) => dispatch(selectItem(item))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ToolBar)
