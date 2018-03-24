import * as React from 'react'
import {DialogActions, DialogContent, DialogTitle} from "material-ui"
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";


export interface CreateNewDialogProps {
  open: boolean
  onClose: () => void
}

export interface CreateNewDialogState {
  isError: boolean
  errorText: string
}

export class CreateNewDialog extends React.Component<CreateNewDialogProps, CreateNewDialogState> {

  constructor(props: CreateNewDialogProps) {
    super(props)
    this.state = {
      isError: false,
      errorText: ' '
    }

    this.onClose = this.onClose.bind(this)
    this.onTextChange = this.onTextChange.bind(this)
  }

  onClose() {
    if (this.props.onClose) {
      this.props.onClose()
    }

    console.log(Math.random().toString(36).slice(-8))
  }

  onTextChange(e: React.SyntheticEvent<any>) {
    const text = e.currentTarget.value
    if (text && text.match(/.{4,}/)) {
      this.setState({ isError: false, errorText: ' ' })
    } else {
      this.setState({ isError: true, errorText: 'Must be over 4 characters' })
    }
  }


  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.onClose}
      >
        <DialogTitle id="new-layout">{"New Layout"}</DialogTitle>
        <DialogContent>
          <TextField
            error={this.state.isError}
            autoFocus
            margin="normal"
            id="layout-name"
            label="Layout Name"
            helperText={this.state.errorText}
            onChange={this.onTextChange}
          />
        </DialogContent>
        <DialogActions>
          <Button disabled={this.state.isError} variant="raised" onClick={this.onClose} color="primary">
            Create
          </Button>
          <Button onClick={this.onClose} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

