import * as React from "react";
import Dialog from "material-ui/Dialog";
import {DialogActions, DialogContent, DialogTitle} from "material-ui";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";

export interface LayerNameDialogProps {
  title: string
  open: boolean
  onOK: (layerName: string) => void
  onClose: () => void
}

export interface LayerNameDialogState {
  name: string
  isError: boolean
  errorText: string
}


export class LayerNameDialog extends React.Component<LayerNameDialogProps, LayerNameDialogState> {

  constructor(props: LayerNameDialogProps) {
    super(props)
    this.state = {
      name: '',
      isError: false,
      errorText: ' '
    }

    this.onOK = this.onOK.bind(this)
    this.onTextChange = this.onTextChange.bind(this)
  }

  onEnter = (e) => {
    this.setState({
      name: ''
    })
  }

  onOK = (e) => {
    this.props.onOK(this.state.name)
    this.props.onClose()
  }


  onTextChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const text = e.currentTarget.value
    if (text && text.match(/.+/)) {
      this.setState({
        name: text,
        isError: false,
        errorText: ' '
      })
    } else {
      this.setState({
        name: text,
        isError: true,
        errorText: 'Must not be empty.'
      })
    }
  }


  render() {
    const { open, onClose, title } = this.props

    return (
      <Dialog
        open={open}
        onEnter={this.onEnter}
        onClose={onClose}
      >
        <DialogTitle id={title}>{title}</DialogTitle>
        <DialogContent>
          <TextField
            error={this.state.isError}
            autoFocus
            margin="dense"
            id="layer-name"
            label="Layer Name"
            value={this.state.name}
            helperText={this.state.errorText}
            onChange={this.onTextChange}
          />
        </DialogContent>
        <DialogActions>
          <Button disabled={this.state.isError || ! this.state.name} variant="raised" onClick={this.onOK} color="primary">
            OK
          </Button>
          <Button onClick={this.props.onClose} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
