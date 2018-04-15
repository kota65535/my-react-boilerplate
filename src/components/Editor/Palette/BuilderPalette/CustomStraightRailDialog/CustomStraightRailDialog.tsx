import * as React from "react";
import Dialog from "material-ui/Dialog";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel
} from "material-ui";
import Button from "material-ui/Button";
import Input from "material-ui/Input";
import Checkbox from "material-ui/Checkbox";

export interface CustomStraightRailDialogProps {
  open: boolean
  onClose: () => void
  addUserCustomRail: (item: any) => void
}

export interface CustomStraightRailDialogState {
  name: string
  length: string
  errors: any
  errorTexts: any
  isDouble: boolean
}



export default class CustomStraightRailDialog extends React.Component<CustomStraightRailDialogProps, CustomStraightRailDialogState> {

  constructor(props: CustomStraightRailDialogProps) {
    super(props)
    this.state = {
      name: '',
      length: '',
      errors: {
        name: false,
        length: false,
      },
      errorTexts: {
        name: '',
        length: '',
      },
      isDouble: false,
    }

    this.onDoubleChange = this.onDoubleChange.bind(this)
  }

  onEnter = (e) => {
    this.setState({
      length: '',
    })
  }

  onOK = (e) => {
    const {isDouble, length, name} = this.state
    let type = isDouble ? 'DoubleStraightRail' : 'StraightRail'
    this.props.addUserCustomRail({
      type: type,
      length: length,
      name: name,
    })

    this.props.onClose()
  }


  onDoubleChange = (e: React.SyntheticEvent<HTMLInputElement|any>) => {
    this.setState({
      isDouble: ! this.state.isDouble,
    });
  };

  onTextChange = (name: string) => (e: React.SyntheticEvent<HTMLInputElement|any>) => {
    const text = e.currentTarget.value
    if (text && text.match(/\d+/)) {
      this.setState({
        [name]: text,
        errors: {
          ...this.state.errors,
          [name]: false,
        }
      } as CustomStraightRailDialogState)
    } else {
      this.setState({
        [name]: text,
        errors: {
          ...this.state.errors,
          [name]: true,
        },
        errorTexts: {
          ...this.state.errorTexts,
          [name]: 'Must not be empty.'
        }
      } as CustomStraightRailDialogState)
    }
  }


  render() {
    const { open, onClose } = this.props
    const { length, name} = this.state
    const disable = !(length && name)

    return (
      <Dialog
        open={open}
        onEnter={this.onEnter}
        onClose={onClose}
      >
        <DialogTitle id={"custom-straight-rail"}>Custom Straight Rail</DialogTitle>
        <DialogContent>
          <FormGroup>
            <FormControl>
              <InputLabel htmlFor="custom-straight-rail-length">Length</InputLabel>
              <Input
                id="custom-straight-rail-length"
                type="number"
                value={this.state.length}
                onChange={this.onTextChange('length')}
              />
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.isDouble}
                  onChange={this.onDoubleChange}
                />
              }
              label={"Double"}
            />
            <FormControl>
              <InputLabel htmlFor="custom-straight-rail-name">Name</InputLabel>
              <Input
                id="custom-straight-rail-name"
                value={this.state.name}
                onChange={this.onTextChange('name')}
              />
            </FormControl>
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button disabled={disable} variant="raised" onClick={this.onOK} color="primary">
            OK
          </Button>
          <Button onClick={onClose} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
