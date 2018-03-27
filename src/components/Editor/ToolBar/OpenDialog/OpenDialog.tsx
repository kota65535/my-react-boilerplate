import * as React from 'react'
import {CardContent, DialogContent, DialogTitle} from "material-ui"
import Dialog from "material-ui/Dialog";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import {LayoutCard} from "components/Editor/ToolBar/OpenDialog/OpenDialog.style";
import {connect} from "react-redux";
import {RootState} from "store/type";
import {S3Image} from 'aws-amplify-react';
import LayoutAPI from "apis/layout"
import * as _ from "lodash";
import getLogger from "logging";
import {loadLayout, setLayoutName} from "actions/layout";
import {LayoutData} from "reducers/layout";
import {getLayoutImageFileName} from "apis/storage";

const LOGGER = getLogger(__filename)

export interface OpenDialogProps {
  open: boolean
  onClose: () => void
  authData: any
  setLayoutName: (name: string) => void
  loadLayout: (data: LayoutData) => void
}

export interface OpenDialogState {
  isLoaded: boolean
  layoutIds: string[]
  layoutImageFiles: string[]
}

const mapStateToProps = (state: RootState) => {
  return {
    authData: state.tools.authData
  }
};

const mapDispatchToProps = dispatch => {
  return {
    setLayoutName: (name: string) => dispatch(setLayoutName(name)),
    loadLayout: (data: LayoutData) => dispatch(loadLayout(data))
  }
};

export class OpenDialog extends React.Component<OpenDialogProps, OpenDialogState> {

  constructor(props: OpenDialogProps) {
    super(props)
    this.state = {
      isLoaded: false,
      layoutIds: [],
      layoutImageFiles: []
    }

    this.onClick = this.onClick.bind(this)
    this.onClose = this.onClose.bind(this)
    this.loadLayoutList = this.loadLayoutList.bind(this)
  }

  async loadLayoutList() {
    const r1 = await LayoutAPI.fetchLayoutList(this.props.authData.username)
    this.setState({
      isLoaded: true,
      layoutIds: r1['layouts'],
      layoutImageFiles: r1['layouts'].map(id => getLayoutImageFileName(this.props.authData.username, id))
    })
  }


  onClick = (name: string) => async (e) => {
    this.props.setLayoutName(name)
    const data = await LayoutAPI.fetchLayoutData(this.props.authData.username, name)
    LOGGER.info(data)
    this.props.loadLayout(data)
    this.onClose()
  }

  onClose() {
    if (this.props.onClose) {
      this.props.onClose()
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
          {_.range(this.state.layoutIds.length).map(idx => {
            return (
              <Button onClick={this.onClick(this.state.layoutIds[idx])} color="primary">
              <LayoutCard>
                <CardContent>
                  <S3Image level={'private'} imgKey={this.state.layoutImageFiles[idx]}/>
                  <Typography gutterBottom variant="headline" component="h3">
                    {this.state.layoutIds[idx]}
                  </Typography>
                </CardContent>
              </LayoutCard>
              </Button>
            )
          })}
        </DialogContent>
        {/*<DialogActions>*/}
          {/*<Button disabled={this.state.isError} variant="raised" onClick={this.onClose} color="primary">*/}
            {/*Create*/}
          {/*</Button>*/}
          {/*<Button onClick={this.onClose} color="primary" autoFocus>*/}
            {/*Cancel*/}
          {/*</Button>*/}
        {/*</DialogActions>*/}
      </Dialog>
    )
  }
}

export const OpenDialogContainer = connect(mapStateToProps, mapDispatchToProps)(OpenDialog)

