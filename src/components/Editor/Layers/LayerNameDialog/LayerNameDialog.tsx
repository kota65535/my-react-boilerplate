import * as React from "react";
import Dialog from "material-ui/Dialog";
import {DialogActions, DialogContent, DialogTitle} from "material-ui";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";

export interface RenameLayerDialogProps {
  title: string
  open: boolean
  onOK: (layerName: string) => void
  onClose: () => void
}

export interface RenameLayerDialogState {
  name: string
  isError: boolean
  errorText: string
}


export class LayerNameDialog extends React.Component<RenameLayerDialogProps, RenameLayerDialogState> {

  constructor(props: RenameLayerDialogProps) {
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
            autoFocus
            margin="dense"
            id="layer-name"
            label="Layer Name"
            value={this.state.name}
            onChange={this.onTextChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.onOK} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
