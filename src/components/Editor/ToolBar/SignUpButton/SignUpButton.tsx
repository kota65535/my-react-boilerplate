import * as React from 'react'
import getLogger from "logging";
import Button from "material-ui/Button";

const LOGGER = getLogger(__filename)


export interface SignUpButtonProps {
  className?: string
}

export interface SignUpButtonState {
  open: boolean
}

export class SignUpButton extends React.Component<SignUpButtonProps, SignUpButtonState> {

  constructor(props: SignUpButtonProps) {
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
          variant="raised"
          color="secondary"
          onClick={this.openDialog}
          className={this.props.className}
        >
          Sign Up
        </Button>
        {/*<SignUpDialog open={this.state.open} onClose={this.closeMenu} />*/}
      </React.Fragment>
    )
  }
}

