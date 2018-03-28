import * as React from 'react'
import LayersIcon from 'material-ui-icons/Layers';
import {Checkbox, Grid, ListItemText, Paper} from 'material-ui'
import {TitleDiv} from "./Layers.style";
import Rnd from 'react-rnd'
import {LayerData} from "reducers/layout";
import AddLayerButton from "components/Editor/Layers/AddLayerButton/AddLayerButton";
import {LayerListItem} from "components/Editor/Layers/LayerListItem/AddLayerButton";
import getLogger from "logging";
import {getClosest} from "constants/utils";

const LOGGER = getLogger(__filename)

export interface LayersProps {
  className?: string

  layers: LayerData[]
  activeLayerId: number
  nextLayerId: number

  setActiveLayer: (layerId: number) => void
  updateLayer: (item: Partial<LayerData>) => void
  addLayer: (item: LayerData) => void
  deleteLayer: (itemId: number) => void
}


export default class Layers extends React.Component<LayersProps, {}> {

  constructor(props: LayersProps) {
    super(props)
    this.onToggleVisible = this.onToggleVisible.bind(this)
    this.onChangeActive = this.onChangeActive.bind(this)
    this.onAddLayer = this.onAddLayer.bind(this)
    this.onDeleteLayer = this.onDeleteLayer.bind(this)
    this.onRenameLayer = this.onRenameLayer.bind(this)
  }

  onToggleVisible = (layerId: number) => (e: React.SyntheticEvent<HTMLInputElement>) => {
    const targetLayer = this.props.layers.find(layer => layer.id === layerId)
    this.props.updateLayer({
      id: layerId,
      visible: !targetLayer.visible
    })
  }

  onChangeActive = (layerId: number) => (e: React.MouseEvent<HTMLElement>) => {
    this.props.setActiveLayer(layerId)
  }

  onAddLayer = (e: React.MouseEvent<HTMLInputElement>) => {
    const newLayer = {
      id: this.props.nextLayerId,
      name: 'New Layer',
      visible: true
    }
    this.props.addLayer(newLayer)
  }

  onDeleteLayer = (layerId: number) => (e: React.MouseEvent<HTMLElement>) => {
    console.log('delete' + layerId)
    if (this.props.layers.length < 2) {
      LOGGER.warn(`You cannot delete the last layer.`)
      return
    }
    const restLayerIds = this.props.layers
      .map(layer => layer.id)
      .filter(id => id !== layerId)

    this.props.deleteLayer(layerId)
    this.props.setActiveLayer(getClosest(layerId, restLayerIds))
  }

  onRenameLayer = (layerId: number) => (e: React.MouseEvent<HTMLElement>) => {
    console.log('rename' + layerId)
  }

  render() {
    const {layers, activeLayerId} = this.props

    return (
      <Rnd
        className={this.props.className}
        enableResizing={{}}
        dragHandleClassName='.Layers__title'
      >
        <Paper>
          <TitleDiv className='Layers__title'>
            <LayersIcon />
            Layers
            <AddLayerButton onClick={this.onAddLayer}/>
          </TitleDiv>
          {layers.map((layer, index) => {
            return <Grid container justify="center" spacing={0}>
              <Grid item xs={3} key={`${index}-1`}>
                <Checkbox
                  checked={layers[index].visible}
                  onChange={this.onToggleVisible(layer.id)}
                  value={layers[index].id.toString()}
                />
              </Grid>
              <Grid item xs={9} key={`${index}-2`}>
                <LayerListItem
                  button
                  active={activeLayerId === layer.id}
                  onClick={this.onChangeActive(layer.id)}
                  onDelete={this.onDeleteLayer(layer.id)}
                  onRename={this.onRenameLayer(layer.id)}
                >
                  <ListItemText primary={layer.name}/>
                </LayerListItem>
              </Grid>
            </Grid>
          })}
        </Paper>
      </Rnd>
    )
  }
}

