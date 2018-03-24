import * as React from 'react'
import {DialogActions, DialogContent, DialogTitle} from "material-ui"
import Dialog from "material-ui/Dialog";
import AuthenticatorContainer from "components/Editor/ToolBar/LoginDialog/Authenticator/AuthenticatorContainer";


export interface LoginDialogProps {
  open: boolean
  onClose: () => void
}


export class LoginDialog extends React.Component<LoginDialogProps, {}> {

  constructor(props: LoginDialogProps) {
    super(props)

    this.onClose = this.onClose.bind(this)
    this.onSignedIn = this.onSignedIn.bind(this)
  }

  onClose() {
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  onSignedIn() {
    this.onClose()
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.onClose}
      >
        <DialogTitle id="login">{"Login"}</DialogTitle>
        <DialogContent>
          <AuthenticatorContainer onSignedIn={this.onSignedIn}/>
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>
    )
  }
}

