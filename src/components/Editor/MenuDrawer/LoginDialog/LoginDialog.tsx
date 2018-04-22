import * as React from 'react'
import {DialogActions, DialogContent} from "material-ui"
import Dialog from "material-ui/Dialog";
import AuthWrapper from "components/Editor/MenuDrawer/LoginDialog/AuthWrapper";
import {AuthState} from "components/Editor/MenuDrawer/LoginDialog/Authenticator/AuthPiece/AuthPiece";


export interface LoginDialogProps {
  open: boolean
  onClose: () => void

  snackbar: any
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
    this.props.snackbar.showMessage('Logged-in successfully!')
    this.onClose()
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.onClose}
      >
        <DialogContent>
          <AuthWrapper onSignedIn={this.onSignedIn} authState={AuthState.SIGN_IN} />
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>
    )
  }
}

