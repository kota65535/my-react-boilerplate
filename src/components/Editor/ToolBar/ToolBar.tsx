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
import CloudIcon from "material-ui-icons/Cloud";
import SaveIcon from "material-ui-icons/Save";
import OpenInNewIcon from "material-ui-icons/OpenInNew";
import LoginIcon from "material-ui-icons/LockOpen";
import LogoutIcon from "material-ui-icons/Lock";
import FeederIcon from "./Icon/Feeder";
import GapIcon from "./Icon/Gap";
import {selectPaletteItem} from "actions/builder";
import {PaletteItem, RootState} from "store/type";
import {LastPaletteItems} from "reducers/builder";
import {redo, undo} from "actions/layout";
import {canRedo, canUndo, currentLayoutDataString} from "selectors";
import {CreateNewDialog} from "components/Editor/ToolBar/CreateNewDialog/CreateNewDialog";
import {OpenDialog} from "components/Editor/ToolBar/OpenDialog/OpenDialog";
import {LoginDialog} from "components/Editor/ToolBar/LoginDialog/LoginDialog";
import {Auth} from 'aws-amplify';
import AuthenticatorContainer from "components/Editor/ToolBar/LoginDialog/Authenticator/AuthenticatorContainer";

export interface ToolBarProps {
  activeTool: string
  setTool: any

  lastPaletteItems: LastPaletteItems
  currentLayoutDataString: string
  canUndo: boolean
  canRedo: boolean
  authData: any

  selectPaletteItem: (item: PaletteItem) => void
  undo: () => void
  redo: () => void
  removeSelectedItems: () => void
  resetViewPosition: () => void
}

export interface ToolBarState {
  openCreateNew: boolean
  openOpen: boolean
  openLogin: boolean
  el: HTMLElement | undefined
}

const mapStateToProps = (state: RootState) => {
  return {
    lastPaletteItems: state.builder.lastPaletteItems,
    currentLayoutDataString: currentLayoutDataString(state),
    canUndo: canUndo(state),
    canRedo: canRedo(state),
    authData: state.tools.authData
  }
};

const mapDispatchToProps = dispatch => {
  return {
    selectPaletteItem: (item: PaletteItem) => dispatch(selectPaletteItem(item)),
    undo: () => dispatch(undo({})),
    redo: () => dispatch(redo({}))
  }
};

export class ToolBar extends React.Component<ToolBarProps, ToolBarState> {

  constructor(props: ToolBarProps) {
    super(props)
    this.state = {
      openCreateNew: false,
      openOpen: false,
      openLogin: false,
      el: undefined,
    }

    this.openCreateNewDialog = this.openCreateNewDialog.bind(this)
    this.closeCreateNewDialog = this.closeCreateNewDialog.bind(this)
    this.openOpenDialog = this.openOpenDialog.bind(this)
    this.closeOpenDialog = this.closeOpenDialog.bind(this)
    this.openLoginDialog = this.openLoginDialog.bind(this)
    this.closeLoginDialog = this.closeLoginDialog.bind(this)
  }

  isActive(tool: string) {
    return this.props.activeTool === tool ? 'active' : ''
  }

  handleBuilderToolsClick = (tool: Tools, e: MouseEvent) => {
    this.props.setTool(tool)
    // 最後に選択していたアイテムを選択する
    this.props.selectPaletteItem(this.props.lastPaletteItems[tool])
  }

  save() {
    console.log(this.props.currentLayoutDataString)
  }

  openLoginDialog() {
    this.setState({
      openLogin: true
    })
  }

  closeLoginDialog() {
    this.setState({
      openLogin: false
    })
  }

  openCreateNewDialog() {
    this.setState({
      openCreateNew: true
    })
  }

  closeCreateNewDialog() {
    this.setState({
      openCreateNew: false
    })
  }

  openOpenDialog() {
    this.setState({
      openOpen: true
    })
  }

  closeOpenDialog() {
    this.setState({
      openOpen: false
    })
  }

  logout() {
    Auth.signOut()
  }



  render() {
    return (
      <React.Fragment>
        <AuthenticatorContainer hidden={true} />
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

            <VerticalDivider/>

            <StyledIconButton
              // className={`${this.isActive(Tools.RESET_VIEW)}`}
              onClick={this.openOpenDialog}
            >
              <CloudIcon />
            </StyledIconButton>
            <StyledIconButton
              // className={`${this.isActive(Tools.RESET_VIEW)}`}
              onClick={this.openCreateNewDialog}
            >
              <OpenInNewIcon />
            </StyledIconButton>
            <StyledIconButton
              // className={`${this.isActive(Tools.RESET_VIEW)}`}
              onClick={() => this.save()}
            >
              <SaveIcon />
            </StyledIconButton>

            {! this.props.authData &&
              <StyledIconButton
                // className={`${this.isActive(Tools.RESET_VIEW)}`}
                onClick={this.openLoginDialog}
              >
                <LoginIcon/>
              </StyledIconButton>
            }

            {this.props.authData &&
              <StyledIconButton
                // className={`${this.isActive(Tools.RESET_VIEW)}`}
                onClick={this.logout}
              >
                <LogoutIcon/>
              </StyledIconButton>
            }


          </MuiToolbar>
        </AppBar>
        <CreateNewDialog open={this.state.openCreateNew} onClose={this.closeCreateNewDialog}/>
        <OpenDialog open={this.state.openOpen} onClose={this.closeOpenDialog}/>
        <LoginDialog open={this.state.openLogin} onClose={this.closeLoginDialog}/>
      </React.Fragment>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ToolBar)
