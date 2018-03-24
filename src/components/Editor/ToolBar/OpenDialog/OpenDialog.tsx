import * as React from 'react'
import {CardContent, DialogActions, DialogContent, DialogTitle} from "material-ui"
import Dialog from "material-ui/Dialog";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import {LayoutCard} from "components/Editor/ToolBar/OpenDialog/OpenDialog.style";
import LayoutAPI from "apis/layout"
import {connect} from "react-redux";
import {RootState} from "store/type";
import getLogger from "logging";

const LOGGER = getLogger(__filename)

export interface OpenDialogProps {
  open: boolean
  onClose: () => void
  authData: any
}

export interface OpenDialogState {
  isError: boolean
  errorText: string
  layouts: string[]
}

const mapStateToProps = (state: RootState) => {
  return {
    authData: state.tools.authData
  }
};

const mapDispatchToProps = dispatch => {
  return {}
};

export class OpenDialog extends React.Component<OpenDialogProps, OpenDialogState> {

  constructor(props: OpenDialogProps) {
    super(props)
    this.state = {
      isError: false,
      errorText: ' ',
      layouts: []
    }

    this.onClose = this.onClose.bind(this)
    this.onTextChange = this.onTextChange.bind(this)
    this.loadLayoutList = this.loadLayoutList.bind(this)
  }

  async loadLayoutList() {
    const layouts = await LayoutAPI.fetchLayoutList(this.props.authData.email)
    LOGGER.info(layouts)
    this.setState({
      layouts: layouts['layouts']
    })
  }


  onClose() {
    if (this.props.onClose) {
      this.props.onClose()
    }
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
        onEnter={this.loadLayoutList}
      >
        <DialogTitle id="open-layout">{"Open Layout"}</DialogTitle>
        <DialogContent>
          {this.state.layouts.map(layout => {
            return (
              <LayoutCard>
                <CardContent>
                  <Typography gutterBottom variant="headline" component="h2">
                    {layout}
                  </Typography>
                  <Typography component="p">
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                    across all continents except Antarctica
                  </Typography>
                </CardContent>
              </LayoutCard>
            )
          })}
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

export const OpenDialogContainer = connect(mapStateToProps, mapDispatchToProps)(OpenDialog)

