import * as React from 'react'
import {DialogActions, DialogContent, DialogTitle} from "material-ui"
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";
import {setLayoutName} from "actions/layout";
import {RootState} from "store/type";
import {connect} from "react-redux";


export interface CreateNewDialogProps {
  open: boolean
  onClose: () => void

  setLayoutName: (name: string) => void
}

export interface CreateNewDialogState {
  name: string
  isError: boolean
  errorText: string
}

const mapStateToProps = (state: RootState) => {
  return {}
};

const mapDispatchToProps = dispatch => {
  return {
    setLayoutName: (name: string) => dispatch(setLayoutName(name))
  }
};

export class CreateNewDialog extends React.Component<CreateNewDialogProps, CreateNewDialogState> {

  constructor(props: CreateNewDialogProps) {
    super(props)
    this.state = {
      name: '',
      isError: false,
      errorText: ' '
    }

    this.onOK = this.onOK.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onTextChange = this.onTextChange.bind(this)
  }

  onOK() {
    this.props.setLayoutName(this.state.name)
    console.log(Math.random().toString(36).slice(-8))
    this.onClose()
  }

  onClose() {
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  onTextChange(e: React.SyntheticEvent<any>) {
    const text = e.currentTarget.value
    if (text && text.match(/.{4,}/)) {
      this.setState({
        name: text,
        isError: false,
        errorText: ' '
      })
    } else {
      this.setState({
        name: text,
        isError: true,
        errorText: 'Must be over 4 characters'
      })
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
          <Button disabled={this.state.isError} variant="raised" onClick={this.onOK} color="primary">
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


export const CreateNewDialogContainer = connect(mapStateToProps, mapDispatchToProps)(CreateNewDialog)
