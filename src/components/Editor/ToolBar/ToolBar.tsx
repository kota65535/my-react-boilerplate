import * as React from 'react'
import CurveRailIcon from './Icon/CurveRail'
import StraightRailIcon from './Icon/StraightRail'
import TurnoutIcon from './Icon/Turnout'
import {AppBar, Toolbar as MuiToolbar} from "material-ui"
import {StyledIconButton, VerticalDivider} from "./ToolBar.style";
import {Tools} from "constants/tools";
import {connect} from "react-redux";
import UndoIcon from 'material-ui-icons/Undo'
import RedoIcon from 'material-ui-icons/Redo'
import DeleteIcon from 'material-ui-icons/Delete'
import PanToolIcon from 'material-ui-icons/PanTool'
import TouchAppIcon from 'material-ui-icons/TouchApp'
import AspectRatioIcon from "material-ui-icons/AspectRatio";
import FeederIcon from "./Icon/Feeder";
import GapIcon from "./Icon/Gap";
import {selectPaletteItem} from "actions/builder";
import {PaletteItem, RootState} from "store/type";
import {LastPaletteItems} from "reducers/builder";


export interface ToolBarProps {
  activeTool: string
  setTool: any
  selectPaletteItem: (item: PaletteItem) => void
  lastPaletteItems: LastPaletteItems
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  removeSelectedItems: () => void
  resetViewPosition: () => void
}

export interface ToolBarState {
  open: boolean
  el: HTMLElement | undefined
}

const mapStateToProps = (state: RootState) => {
  return {
    lastPaletteItems: state.builder.lastPaletteItems
  }
};

const mapDispatchToProps = dispatch => {
  return {
    selectPaletteItem: (item: PaletteItem) => dispatch(selectPaletteItem(item))
  }
};

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

  handleBuilderToolsClick = (tool: Tools, e: MouseEvent) => {
    this.props.setTool(tool)
    // 最後に選択していたアイテムを選択する
    this.props.selectPaletteItem(this.props.lastPaletteItems[tool])
  }

  render() {
    return (
      <AppBar>
        <MuiToolbar>
          <StyledIconButton
            className={`${this.isActive(Tools.STRAIGHT_RAILS)}`}
            onClick={this.handleBuilderToolsClick.bind(this, Tools.STRAIGHT_RAILS)}
          >
            <StraightRailIcon/>
          </StyledIconButton>
          <StyledIconButton
            className={`${this.isActive(Tools.CURVE_RAILS)}`}
            onClick={this.handleBuilderToolsClick.bind(this, Tools.CURVE_RAILS)}
          >
            <CurveRailIcon/>
          </StyledIconButton>
          <StyledIconButton
            className={`${this.isActive(Tools.TURNOUTS)}`}
            onClick={this.handleBuilderToolsClick.bind(this, Tools.TURNOUTS)}
          >
            <TurnoutIcon/>
          </StyledIconButton>
          <StyledIconButton
            className={`${this.isActive(Tools.FEEDERS)}`}
            onClick={this.handleBuilderToolsClick.bind(this, Tools.FEEDERS)}
          >
            <FeederIcon/>
          </StyledIconButton>
          <StyledIconButton
            className={`${this.isActive(Tools.GAP)}`}
            onClick={this.handleBuilderToolsClick.bind(this, Tools.GAP)}
          >
            <GapIcon/>
          </StyledIconButton>
          <VerticalDivider/>

          {/*<Menu*/}
          {/*open={this.state.open}*/}
          {/*onClose={this.handlePutToolClose}*/}
          {/*anchorEl={this.state.el}*/}
          {/*>*/}
          {/*<MenuItem data-value="rectangle" onClick={this.handlePutToolClose}>Rectangle</MenuItem>*/}
          {/*<MenuItem data-value="circle" onClick={this.handlePutToolClose}>Circle</MenuItem>*/}
          {/*</Menu>*/}

          <StyledIconButton
            className={`${this.isActive('undo') && this.props.canUndo}`}
            onClick={this.props.undo}>
            <UndoIcon/>
          </StyledIconButton>
          <StyledIconButton
            className={`${this.isActive('redo') && this.props.canRedo}`}
            onClick={() => this.props.redo()}>
            <RedoIcon/>
          </StyledIconButton>
          <StyledIconButton
            className={`${this.isActive(Tools.DELETE)}`}
            onClick={() => this.props.setTool(Tools.DELETE)}>
            <DeleteIcon/>
          </StyledIconButton>
          <StyledIconButton
            className={`${this.isActive(Tools.SELECT)}`}
            onClick={() => this.props.setTool(Tools.SELECT)}
          >
            <TouchAppIcon/>
          </StyledIconButton>
          <StyledIconButton
            className={`${this.isActive(Tools.PAN)}`}
            onClick={() => this.props.setTool(Tools.PAN)}
          >
            <PanToolIcon/>
          </StyledIconButton>
          <StyledIconButton
            className={`${this.isActive(Tools.RESET_VIEW)}`}
            onClick={() => this.props.resetViewPosition()}
          >
            <AspectRatioIcon/>
          </StyledIconButton>
        </MuiToolbar>
      </AppBar>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ToolBar)
