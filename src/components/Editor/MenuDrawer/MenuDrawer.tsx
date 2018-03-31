import * as React from "react";
import {ListItem, ListItemIcon, ListItemText} from "material-ui";
import Drawer from "material-ui/Drawer";
import List from "material-ui/List";
import CloudIcon from "material-ui-icons/Cloud";
import OpenInNewIcon from "material-ui-icons/OpenInNew";
import SaveIcon from "material-ui-icons/Save";
import LoginIcon from "material-ui-icons/LockOpen";
import LogoutIcon from "material-ui-icons/Lock";
import LayoutNameDialog from "components/Editor/ToolBar/NewLayoutDialog";
import OpenDialog from "components/Editor/ToolBar/OpenDialog";
import {LoginDialog} from "components/Editor/ToolBar/LoginDialog/LoginDialog";
import Auth from "aws-amplify/lib/Auth";
import LayoutAPI from "apis/layout"
import StorageAPI from "apis/storage"
import {LayoutData, LayoutMeta} from "reducers/layout";
import AuthenticatorContainer from "components/Editor/ToolBar/LoginDialog/Authenticator/AuthenticatorContainer";
import Divider from "material-ui/Divider";
import getLogger from "logging";

const LOGGER = getLogger(__filename)


export interface MenuDrawerProps {
  open: boolean
  onClose: () => void
  authData: any

  currentLayoutData: LayoutData
  layoutMeta: LayoutMeta

}

export interface MenuDrawerState {
  openCreateNew: boolean
  openSaveNew: boolean
  openOpen: boolean
  openLogin: boolean
}


export class MenuDrawer extends React.Component<MenuDrawerProps, MenuDrawerState> {

  constructor(props: MenuDrawerProps) {
    super(props)
    this.state = {
      openCreateNew: false,
      openSaveNew: false,
      openOpen: false,
      openLogin: false
    }
  }


  save = async () => {
    const userId = this.props.authData.username
    if (this.props.layoutMeta) {
      const savedData = {
        layout: this.props.currentLayoutData,
        meta: this.props.layoutMeta
      }
      LOGGER.info(savedData)
      LayoutAPI.saveLayoutData(userId, savedData)
      StorageAPI.saveCurrentLayoutImage(userId, this.props.layoutMeta.id)
      this.closeMenu()
    } else {
      this.openSaveNewDialog()
    }
  }

  openLoginDialog = () => {
    this.setState({
      openLogin: true
    })
    // this.closeMenu()
  }

  closeLoginDialog = () => {
    this.setState({
      openLogin: false
    })
    this.closeMenu()
  }

  openCreateNewDialog = () => {
    this.setState({
      openCreateNew: true
    })
  }

  closeCreateNewDialog = () => {
    this.setState({
      openCreateNew: false
    })
    this.closeMenu()
  }

  openSaveNewDialog = () => {
    this.setState({
      openSaveNew: true
    })
  }

  closeSaveNewDialog = () => {
    this.setState({
      openSaveNew: false
    })
    this.closeMenu()
  }

  openOpenDialog = () => {
    this.setState({
      openOpen: true
    })
  }

  closeOpenDialog = () => {
    this.setState({
      openOpen: false
    })
    this.closeMenu()
  }

  logout = async () => {
    await Auth.signOut()
    this.closeMenu()
  }

  closeMenu = () => {
    this.props.onClose()
  }



  render() {
    const { open, onClose }  = this.props

    return (
      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
      >
        {/*これが無いとログアウト時にフックしてくれないので必須*/}
        <AuthenticatorContainer hidden={true}/>
        <div
          tabIndex={0}
          role="button"
          // onClick={this.toggleDrawer('left', false)}
          // onKeyDown={this.toggleDrawer('left', false)}
        >
          <List>
            {! this.props.authData &&
            <ListItem button
                      onClick={this.openLoginDialog}
              >
                <ListItemIcon>
                  <LoginIcon/>
                </ListItemIcon>
                <ListItemText primary="Login"/>
              </ListItem>
            }
            {this.props.authData &&
              <React.Fragment>
                <ListItem button onClick={this.logout}>
                  <ListItemIcon>
                    <LogoutIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Logout"/>
                </ListItem>
                <Divider />
                <ListItem button onClick={this.openOpenDialog}>
                  <ListItemIcon>
                    <CloudIcon/>
                  </ListItemIcon>
                  <ListItemText primary="My Layouts"/>
                </ListItem>
                <ListItem button onClick={this.openCreateNewDialog}>
                  <ListItemIcon>
                    <OpenInNewIcon/>
                  </ListItemIcon>
                  <ListItemText primary="New Layout"/>
                </ListItem>
                <ListItem button onClick={this.save}>
                  <ListItemIcon>
                    <SaveIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Save"/>
                </ListItem>
              </React.Fragment>
            }
          </List>
          <LayoutNameDialog
            title={"Create New Layout"}
            okButtonTitle={"Create"}
            open={this.state.openCreateNew}
            onClose={this.closeCreateNewDialog}/>
          <LayoutNameDialog
            save
            title={"Save New Layout"}
            okButtonTitle={"Save"}
            open={this.state.openSaveNew} onClose={this.closeSaveNewDialog}/>
          <OpenDialog open={this.state.openOpen} onClose={this.closeOpenDialog}/>
          <LoginDialog open={this.state.openLogin} onClose={this.closeLoginDialog}/>
        </div>
      </Drawer>
    )
  }
}
