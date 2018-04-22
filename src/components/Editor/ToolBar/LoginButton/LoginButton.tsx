import * as React from 'react'
import getLogger from "logging";
import Button from "material-ui/Button";
import LoginDialog from "components/Editor/MenuDrawer/LoginDialog";

const LOGGER = getLogger(__filename)


export interface LoginButtonProps {
  className?: string
}

export interface LoginButtonState {
  open: boolean
}

export class LoginButton extends React.Component<LoginButtonProps, LoginButtonState> {

  constructor(props: LoginButtonProps) {
    super(props)
    this.state = {
      open: false,
    }
  }

  openDialog = (e) => {
    this.setState({
      open: true
    })
  }

  closeMenu = () => {
    this.setState({
      open: false
    })
  }


  render() {
    return (
      <React.Fragment>
        <Button
          onClick={this.openDialog}
          className={this.props.className}
        >
          Login
        </Button>
        <LoginDialog open={this.state.open} onClose={this.closeMenu} />
      </React.Fragment>
    )
  }
}

