import * as React from 'react'
import {CardContent, DialogContent, DialogTitle} from "material-ui"
import Dialog from "material-ui/Dialog";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import {LayoutCard} from "components/Editor/MenuDrawer/OpenDialog/OpenDialog.style";
import {S3Image} from 'aws-amplify-react';
import LayoutAPI from "apis/layout"
import * as _ from "lodash";
import getLogger from "logging";
import {LayoutData, LayoutMeta} from "reducers/layout";
import {getLayoutImageFileName} from "apis/storage";

const LOGGER = getLogger(__filename)

export interface OpenDialogProps {
  open: boolean
  onClose: () => void
  authData: any
  setLayoutMeta: (meta: LayoutMeta) => void
  setLayoutData: (data: LayoutData) => void
}

export interface OpenDialogState {
  isLoaded: boolean
  layoutMetas: LayoutMeta[]
  layoutImageFiles: string[]
}


export class OpenDialog extends React.Component<OpenDialogProps, OpenDialogState> {

  constructor(props: OpenDialogProps) {
    super(props)
    this.state = {
      isLoaded: false,
      layoutMetas: [],
      layoutImageFiles: []
    }

    this.onClick = this.onClick.bind(this)
    this.onClose = this.onClose.bind(this)
    this.loadLayoutList = this.loadLayoutList.bind(this)
  }

  async loadLayoutList() {
    const list = await LayoutAPI.fetchLayoutList(this.props.authData.username)
    LOGGER.info(list)
    this.setState({
      isLoaded: true,
      layoutMetas: list['layouts'],
      layoutImageFiles: list['layouts'].map(meta => getLayoutImageFileName(this.props.authData.username, meta.id))
    })
  }


  onClick = (meta: LayoutMeta) => async (e) => {
    this.props.setLayoutMeta(meta)
    const data = await LayoutAPI.fetchLayoutData(this.props.authData.username, meta.id)
    LOGGER.info(data)
    this.props.setLayoutData(data.layout)
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
        fullWidth
        maxWidth='md'
      >
        <DialogTitle id="my-layouts">{"My Layouts"}</DialogTitle>
        <DialogContent>
          <Typography>
            You have {this.state.layoutMetas.length} layouts.
          </Typography>
          {_.range(this.state.layoutMetas.length).map(idx => {
            return (
              <Button onClick={this.onClick(this.state.layoutMetas[idx])}
                      color="primary"
              >
              <LayoutCard>
                <CardContent>
                  <S3Image level={'private'} imgKey={this.state.layoutImageFiles[idx]}/>
                  <Typography align="left" variant="body2">
                    Title: {this.state.layoutMetas[idx].name}
                  </Typography>
                  {/*<Typography>*/}
                    {/*ID: {this.state.layoutMetas[idx].id}*/}
                  {/*</Typography>*/}
                  <Typography align="left" variant="body2">
                    Last modified: {this.state.layoutMetas[idx].lastModified}
                  </Typography>
                </CardContent>
              </LayoutCard>
              </Button>
            )
          })}
        </DialogContent>
      </Dialog>
    )
  }
}

