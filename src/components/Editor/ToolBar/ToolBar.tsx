import * as React from 'react'
import CurveRailIcon from './Icon/CurveRail'
import StraightRailIcon from './Icon/StraightRail'
import TurnoutIcon from './Icon/Turnout'
import {AppBar, Toolbar as MuiToolbar} from "material-ui"
import {StyledIconButton, VerticalDivider} from "./styles";
import {Tools} from "constants/tools";
import UndoIcon from 'material-ui-icons/Undo'
import RedoIcon from 'material-ui-icons/Redo'
import DeleteIcon from 'material-ui-icons/Delete'
import PanToolIcon from 'material-ui-icons/PanTool'
import TouchAppIcon from 'material-ui-icons/TouchApp'
import AspectRatioIcon from "material-ui-icons/AspectRatio";
import MenuIcon from "material-ui-icons/Menu";
import FeederIcon from "./Icon/Feeder";
import GapIcon from "./Icon/Gap";
import {PaletteItem} from "store/type";
import {LastPaletteItems} from "reducers/builder";
import {LayoutData, LayoutMeta} from "reducers/layout";
import getLogger from "logging";
import Typography from "material-ui/Typography";
import * as classNames from "classnames"
import MenuDrawer from "components/Editor/MenuDrawer";
import Tooltip from "material-ui/Tooltip";

const LOGGER = getLogger(__filename)

export interface ToolBarProps {
  activeTool: string
  setTool: any

  lastPaletteItems: LastPaletteItems
  currentLayoutData: LayoutData
  canUndo: boolean
  canRedo: boolean
  // authData: any
  layoutMeta: LayoutMeta

  selectPaletteItem: (item: PaletteItem) => void
  undo: () => void
  redo: () => void
  removeSelectedItems: () => void
  resetViewPosition: () => void
}

export interface ToolBarState {
  openMenu: boolean
  el: HTMLElement | undefined
}


export class ToolBar extends React.Component<ToolBarProps, ToolBarState> {

  constructor(props: ToolBarProps) {
    super(props)
    this.state = {
      openMenu: false,
      el: undefined,
    }

  }

  isActive(tool: string) {
    return this.props.activeTool === tool
  }

  onClickBuilderItem = (tool: Tools) => (e: MouseEvent) => {
    this.props.setTool(tool)
    // 最後に選択していたアイテムを選択する
    this.props.selectPaletteItem(this.props.lastPaletteItems[tool])
  }


  openMenu = (e) => {
    LOGGER.info(this.props.layoutMeta)
    this.setState({
      openMenu: true
    })
  }

  closeMenu = () => {
    this.setState({
      openMenu: false
    })
  }


  render() {
    return (
      <React.Fragment>
        <AppBar>
          <MuiToolbar>
            <Tooltip id="tooltip-straight-rail" title={Tools.STRAIGHT_RAILS}>
              <StyledIconButton
                className={classNames({
                  'active': this.isActive(Tools.STRAIGHT_RAILS)
                })}
                onClick={this.onClickBuilderItem(Tools.STRAIGHT_RAILS)}
              >
                <StraightRailIcon/>
              </StyledIconButton>
            </Tooltip>
            <Tooltip id="tooltip-curve-rail" title={Tools.CURVE_RAILS}>
              <StyledIconButton
                className={classNames({
                  'active': this.isActive(Tools.CURVE_RAILS)
                })}
                onClick={this.onClickBuilderItem(Tools.CURVE_RAILS)}
              >
                <CurveRailIcon/>
              </StyledIconButton>
            </Tooltip>
            <Tooltip id="tooltip-turnout-rail" title={Tools.TURNOUTS}>
              <StyledIconButton
                className={classNames({
                  'active': this.isActive(Tools.TURNOUTS)
                })}
                onClick={this.onClickBuilderItem(Tools.TURNOUTS)}
              >
                <TurnoutIcon/>
              </StyledIconButton>
            </Tooltip>
            <Tooltip id="tooltip-feeders" title={Tools.FEEDERS}>
              <StyledIconButton
                className={classNames({
                  'active': this.isActive(Tools.FEEDERS)
                })}
                onClick={this.onClickBuilderItem(Tools.FEEDERS)}
              >
                <FeederIcon/>
              </StyledIconButton>
            </Tooltip>
            <Tooltip id="tooltip-gap" title={Tools.GAP}>
              <StyledIconButton
                className={classNames({
                  'active': this.isActive(Tools.GAP)
                })}
                onClick={this.onClickBuilderItem(Tools.GAP)}
              >
                <GapIcon/>
              </StyledIconButton>
            </Tooltip>

            <VerticalDivider/>

            <Tooltip id="tooltip-undo" title={Tools.UNDO}>
              <StyledIconButton
                className={classNames({
                  'active': this.isActive(Tools.UNDO),
                  'disabled': ! this.props.canUndo
                })}
                onClick={this.props.undo}>
                <UndoIcon/>
              </StyledIconButton>
            </Tooltip>
            <Tooltip id="tooltip-redo" title={Tools.REDO}>
              <StyledIconButton
                className={classNames({
                  'active': this.isActive(Tools.REDO),
                  'disabled': ! this.props.canRedo
                })}
                onClick={this.props.redo}>
                <RedoIcon/>
              </StyledIconButton>
            </Tooltip>
            <Tooltip id="tooltip-delete" title={Tools.DELETE}>
              <StyledIconButton
                className={classNames({
                  'active': this.isActive(Tools.DELETE)
                })}
                onClick={() => this.props.setTool(Tools.DELETE)}>
                <DeleteIcon/>
              </StyledIconButton>
            </Tooltip>
            <Tooltip id="tooltip-select" title={Tools.SELECT}>
              <StyledIconButton
                className={classNames({
                  'active': this.isActive(Tools.SELECT)
                })}
                onClick={() => this.props.setTool(Tools.SELECT)}
              >
                <TouchAppIcon/>
              </StyledIconButton>
            </Tooltip>
            <Tooltip id="tooltip-pan" title={Tools.PAN}>
              <StyledIconButton
                className={classNames({
                  'active': this.isActive(Tools.PAN)
                })}
                onClick={() => this.props.setTool(Tools.PAN)}
              >
                <PanToolIcon/>
              </StyledIconButton>
            </Tooltip>
            <Tooltip id="tooltip-reset-view" title={Tools.RESET_VIEW}>
              <StyledIconButton
                className={classNames({
                  'active': this.isActive(Tools.RESET_VIEW)
                })}
                onClick={() => this.props.resetViewPosition()}
              >
                <AspectRatioIcon/>
              </StyledIconButton>
            </Tooltip>

            {/* メニューアイコンを右端に配置するため */}
            <Typography variant="title" color="inherit" style={{flex: 1}} />
            <Tooltip id="tooltip-menu" title={"Menu"}>
              <StyledIconButton
                onClick={this.openMenu}
              >
                <MenuIcon/>
              </StyledIconButton>
            </Tooltip>
          </MuiToolbar>
        </AppBar>
        <MenuDrawer open={this.state.openMenu} onClose={this.closeMenu}/>
      </React.Fragment>
    )
  }
}

