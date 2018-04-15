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

export interface CustomCurveRailDialogProps {
  open: boolean
  onClose: () => void
  addUserCustomRail: (item: any) => void
}

export interface CustomCurveRailDialogState {
  name: string
  radius: string
  centerAngle: string
  errors: any
  errorTexts: any
  isDouble: boolean
}


export default class CustomCurveRailDialog extends React.Component<CustomCurveRailDialogProps, CustomCurveRailDialogState> {

  constructor(props: CustomCurveRailDialogProps) {
    super(props)
    this.state = {
      name: '',
      radius: '',
      centerAngle: '',
      errors: {
        name: false,
        radius: false,
        centerAngle: false,
      },
      errorTexts: {
        name: '',
        radius: '',
        centerAngle: '',
      },
      isDouble: false,
    }

    this.onDoubleChange = this.onDoubleChange.bind(this)
  }

  onEnter = (e) => {
    this.setState({
      radius: '',
      centerAngle: '',
    })
  }

  onOK = (e) => {
    const {isDouble, radius, centerAngle, name} = this.state
    let type = isDouble ? 'DoubleCurveRail' : 'CurveRail'
    this.props.addUserCustomRail({
      type: type,
      radius: radius,
      centerAngle: centerAngle,
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
      } as CustomCurveRailDialogState)
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
      } as CustomCurveRailDialogState)
    }
  }


  render() {
    const { open, onClose } = this.props
    const { radius, centerAngle, name} = this.state
    const disable = !(radius && centerAngle && name)

    return (
      <Dialog
        open={open}
        onEnter={this.onEnter}
        onClose={onClose}
      >
        <DialogTitle id={"custom-curve-rail"}>Custom Curve Rail</DialogTitle>
        <DialogContent>
          <FormGroup>
            <FormControl>
              <InputLabel htmlFor="custom-curve-rail-radius">Radius</InputLabel>
              <Input
                id="custom-curve-rail-radius"
                type="number"
                value={this.state.radius}
                onChange={this.onTextChange('radius')}
              />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="custom-curve-rail-center-angle">Center Angle</InputLabel>
              <Input
                id="custom-curve-rail-center-angle"
                type="number"
                value={this.state.centerAngle}
                onChange={this.onTextChange('centerAngle')}
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
              <InputLabel htmlFor="custom-curve-rail-name">Name</InputLabel>
              <Input
                id="custom-curve-rail-name"
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
