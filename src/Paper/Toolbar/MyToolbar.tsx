import * as React from 'react'
import TouchAppIcon from 'material-ui-icons/TouchApp'
import PanToolIcon from 'material-ui-icons/PanTool'
import AddBoxIcon from 'material-ui-icons/AddBox'
import UndoIcon from 'material-ui-icons/Undo'
import RedoIcon from 'material-ui-icons/Redo'
import {IconButton, Menu, MenuItem, Toolbar} from "material-ui"
import {AppBar} from "material-ui"

import './MyToolbar.css'

export interface MyToolBarProps {
  activeTool: string
  setTool: any
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

export interface MyToolbarState {
  open: boolean
  el: HTMLElement | undefined
}

export class MyToolbar extends React.Component<MyToolBarProps, MyToolbarState> {

  constructor(props: MyToolBarProps) {
    super(props)
    this.state = {
      open: false,
      el: undefined
    }

    this.handlePutToolOpen = this.handlePutToolOpen.bind(this)
    this.handlePutToolClose = this.handlePutToolClose.bind(this)
  }

  isActive(...tool: string[]) {
    return tool.includes(this.props.activeTool) ? 'active' : ''
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
        <Toolbar>
          <IconButton
            className={`IconButton ${this.isActive('move')}`}
            onClick={() => this.props.setTool('move')}>
            <PanToolIcon/>
          </IconButton>
          <IconButton
            className={`IconButton ${this.isActive('select')}`}
            onClick={() => this.props.setTool('select')}>
            <TouchAppIcon/>
          </IconButton>
          <IconButton
            className={`IconButton ${this.isActive('rectangle', 'circle')}`}
            onClick={this.handlePutToolOpen}
          >
            <AddBoxIcon/>
          </IconButton>
          <Menu
            open={this.state.open}
            onClose={this.handlePutToolClose}
            anchorEl={this.state.el}
          >
            <MenuItem data-value="rectangle" onClick={this.handlePutToolClose}>Rectangle</MenuItem>
            <MenuItem data-value="circle" onClick={this.handlePutToolClose}>Circle</MenuItem>
          </Menu>
          <IconButton
            className={`IconButton ${this.isActive('undo') && this.props.canUndo}`}
            onClick={() => this.props.undo()}>
            <UndoIcon/>
          </IconButton>
          <IconButton
            className={`IconButton ${this.isActive('redo') && this.props.canRedo}`}
            onClick={() => this.props.redo()}>
            <RedoIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>
    )
  }

    // <div className={'Toolbar'}>
    //   <IconMenu
    //     iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
    //     anchorOrigin={{horizontal: 'left', vertical: 'top'}}
    //     targetOrigin={{horizontal: 'left', vertical: 'top'}}
    //   >
    //   </IconMenu>
    //   {/*<div>*/}
    //     {/*<Button*/}
    //       {/*tool={'move'}*/}
    //       {/*title={'Move Tool (V)'}*/}
    //       {/*active={activeTool === 'move'}*/}
    //       {/*setTool={props.setTool}>*/}
    //       {/*<i className={'material-icons'}>pan_tool</i>*/}
    //     {/*</Button>*/}
    //     {/*<Button*/}
    //       {/*tool={'select'}*/}
    //       {/*title={'Select Tool (A)'}*/}
    //       {/*active={activeTool === 'select'}*/}
    //       {/*setTool={props.setTool}>*/}
    //       {/*<i className={'material-icons'}>touch_app</i>*/}
    //     {/*</Button>*/} //     {/*<Button*/}
    //       {/*tool={'delete'}*/} //       {/*title={'Delete Tool (D)'}*/}
    //       {/*active={activeTool === 'delete'}*/}
    //       {/*setTool={props.setTool}>*/}
    //       {/*<i className={'material-icons'}>delete</i>*/}
    //     {/*</Button>*/}
    //   {/*</div>*/}
    //   {/*<div>*/}
    //     {/*<Button*/}
    //       {/*tool={'undo'}*/}
    //       {/*title={'Undo'}*/}
    //       {/*active={activeTool === 'undo'}*/}
    //       {/*disabled={!props.canUndo}*/}
    //       {/*onClick={props.undo}>*/}
    //       {/*<i className={'material-icons'}>undo</i>*/}
    //     {/*</Button>*/}
    //     {/*<Button*/}
    //       {/*tool={'redo'}*/}
    //       {/*title={'Redo'}*/}
    //       {/*active={activeTool === 'redo'}*/}
    //       {/*disabled={!props.canRedo}*/}
    //       {/*onClick={props.redo}>*/}
    //       {/*<i className={'material-icons'}>redo</i>*/}
    //     {/*</Button>*/}
    //     {/*<Button*/}
    //       {/*tool={'reset'}*/}
    //       {/*title={'Reset View'}*/}
    //       {/*onClick={props.clearHistory}*/}
    //       {/*disabled={!props.canRedo && !props.canUndo}>*/}
    //       {/*<i className={'material-icons'}>clear</i>*/}
    //     {/*</Button>*/}
    //   {/*</div>*/}
    //   {/*<span></span>*/}
    //   {/*<div>*/}
    //     {/*<Button*/}
    //       {/*tool={'layers'}*/}
    //       {/*title={showLayers ? 'Hide Layers' : 'Show Layers'}*/}
    //       {/*active={activeTool === 'layers'}*/}
    //       {/*onClick={props.toggleLayers}>*/}
    //       {/*<i className={'material-icons'}>*/}
    //         {/*{showLayers ? 'layers' : 'layers_clear'}*/}
    //       {/*</i>*/}
    //     {/*</Button>*/}
    //     {/*<Button*/}
    //       {/*tool={'fullscreen'}*/}
    //       {/*title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}*/}
    //       {/*onClick={props.toggleFullscreen}>*/}
    //       {/*<i className={'material-icons'}>*/}
    //         {/*{fullscreen ? 'fullscreen_exit' : 'fullscreen'}*/}
    //       {/*</i>*/}
    //     {/*</Button>*/}
    //   {/*</div>*/}
    //   {/*<span></span>*/}
    //   {/*<div>*/}
    //     {/*<Button*/}
    //       {/*tool={'save'}*/}
    //       {/*title={'Save'}*/}
    //       {/*onClick={props.save}*/}
    //       {/*disabled={!props.canUndo}>*/}
    //       {/*<i className={'material-icons'}>save</i>*/}
    //     {/*</Button>*/}
    //   {/*</div>*/}
    //   {/*<span></span>*/}
    //   {/*<div>*/}
    //     {/*<a title={'Fork me on GitHub'} href={'https://github.com/HriBB/react-paper-bindings'}>*/}
    //       {/*<svg width="22" height="22" version="1.1" viewBox="0 0 16 16">*/}
    //         {/*<path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>*/}
    //       {/*</svg>*/}
    //     {/*</a>*/}
    //   {/*</div>*/}
    // </div>
}


export default MyToolbar
