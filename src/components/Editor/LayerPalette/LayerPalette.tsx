import * as React from 'react'
import LayersIcon from 'material-ui-icons/Layers';
import {Checkbox, Grid, ListItemText, Paper} from 'material-ui'
import {TitleDiv} from "./styles";
import Rnd from 'react-rnd'
import {LayerData} from "reducers/layout";
import AddLayerButton from "components/Editor/LayerPalette/AddLayerButton/AddLayerButton";
import {LayerListItem} from "components/Editor/LayerPalette/LayerListItem/LayerListItem";
import getLogger from "logging";
import {getClosest} from "constants/utils";
import {LayerNameDialog} from "components/Editor/LayerPalette/LayerNameDialog/LayerNameDialog";
import {ConfirmationDialog} from "components/Editor/LayerPalette/ConfirmationDialog/ConfirmationDialog";
import Typography from "material-ui/Typography";

const LOGGER = getLogger(__filename)

export interface LayerPaletteProps {
  className?: string

  layers: LayerData[]
  activeLayerId: number
  nextLayerId: number

  setActiveLayer: (layerId: number) => void
  updateLayer: (item: Partial<LayerData>) => void
  addLayer: (item: LayerData) => void
  deleteLayer: (itemId: number) => void
}

export interface LayerPaletteState {
  targetLayerId: number
  addDialogOpen: boolean
  renameDialogOpen: boolean
  deleteDialogOpen: boolean
}


export default class LayerPalette extends React.Component<LayerPaletteProps, LayerPaletteState> {

  constructor(props: LayerPaletteProps) {
    super(props)
    this.state = {
      targetLayerId: null,
      addDialogOpen: false,
      renameDialogOpen: false,
      deleteDialogOpen: false
    }
    this.onToggleVisible = this.onToggleVisible.bind(this)
    this.onChangeActive = this.onChangeActive.bind(this)
    this.addLayer = this.addLayer.bind(this)
    this.openDeleteDialog = this.openDeleteDialog.bind(this)
    this.openRenameDialog = this.openRenameDialog.bind(this)
  }

  onToggleVisible = (layerId: number) => (e: React.SyntheticEvent<HTMLInputElement>) => {
    const targetLayer = this.props.layers.find(layer => layer.id === layerId)
    this.props.updateLayer({
      id: layerId,
      visible: !targetLayer.visible,
    })
  }

  onChangeActive = (layerId: number) => (e: React.MouseEvent<HTMLElement>) => {
    this.props.setActiveLayer(layerId)
  }


  openAddDialog = (e) => {
    this.setState({
      addDialogOpen: true,
    })
  }

  closeAddDialog = () => {
    this.setState({
      addDialogOpen: false,
    })
  }

  addLayer = (name: string) => {
    const newLayer = {
      id: this.props.nextLayerId,
      name: name,
      visible: true
    }
    this.props.addLayer(newLayer)
  }

  openRenameDialog = (layerId: number) => (e: React.MouseEvent<HTMLElement>) => {
    this.setState({
      renameDialogOpen: true,
      targetLayerId: layerId
    })
  }

  closeRenameDialog = () => {
    this.setState({
      renameDialogOpen: false,
      targetLayerId: null
    })
  }

  renameLayer = (name: string) => {
    this.props.updateLayer({
      id: this.state.targetLayerId,
      name: name
    })
  }

  openDeleteDialog = (layerId: number) => (e: React.MouseEvent<HTMLElement>) => {
    if (this.props.layers.length < 2) {
      LOGGER.warn(`You cannot delete the last layer!`)
      return
    }
    this.setState({
      deleteDialogOpen: true,
      targetLayerId: layerId
    })
  }

  closeDeleteDialog = () => {
    this.setState({
      deleteDialogOpen: false,
      targetLayerId: null
    })
  }

  deleteLayer = () => {
    const layerId = this.state.targetLayerId
    const restLayerIds = this.props.layers
      .map(layer => layer.id)
      .filter(id => id !== layerId)

    this.props.deleteLayer(layerId)
    this.props.setActiveLayer(getClosest(layerId, restLayerIds))
  }


  render() {
    const {layers, activeLayerId} = this.props
    let layerName = ''
    if (this.state.targetLayerId) {
      layerName = this.props.layers.find(layer => layer.id === this.state.targetLayerId).name
    }

    return (
      <Rnd
        className={this.props.className}
        enableResizing={{}}
        dragHandleClassName='.Layers__title'
      >
        <Paper>
          <TitleDiv className='Layers__title'>
            <LayersIcon />
            {/* プラスアイコンを右端に配置するためのスタイル */}
            <Typography variant="subheading" color="inherit" style={{flex: 1}}>
              Layers
            </Typography>
            <AddLayerButton onClick={this.openAddDialog}/>
          </TitleDiv>

          {layers.map((layer, index) =>
            <Grid container justify="center" spacing={0}>
              <Grid item xs={3} key={`${index}-1`}>
                <Checkbox
                  checked={layers[index].visible}
                  onChange={this.onToggleVisible(layer.id)}
                  value={layers[index].id.toString()}
                />
              </Grid>
              <Grid item xs={9} key={`${index}-2`}>
                {/* <Layer> で囲わずにSecondaryActionを使うとズレる */}
                <LayerListItem
                  button
                  active={activeLayerId === layer.id}
                  onClick={this.onChangeActive(layer.id)}
                  onDelete={this.openDeleteDialog(layer.id)}
                  onRename={this.openRenameDialog(layer.id)}
                  isDeletable={this.props.layers.length >= 2}
                >
                  <ListItemText primary={layer.name}/>
                </LayerListItem>
              </Grid>
            </Grid>
          )}
        </Paper>
        <LayerNameDialog
          title={'New Layer'}
          open={this.state.addDialogOpen}
          onOK={this.addLayer}
          onClose={this.closeAddDialog}
        />
        <LayerNameDialog
          title={'Rename Layer'}
          open={this.state.renameDialogOpen}
          onOK={this.renameLayer}
          onClose={this.closeRenameDialog}
        />
        <ConfirmationDialog
          title={'Delete Layer'}
          text={`Are you OK to delete "${layerName}"? \nAll rails on the layer are deleted.`}
          open={this.state.deleteDialogOpen}
          onOK={this.deleteLayer}
          onClose={this.closeDeleteDialog}
        />
      </Rnd>
    )
  }
}

