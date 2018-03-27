import * as React from 'react'
import LayersIcon from 'material-ui-icons/Layers'
import {Checkbox, Grid, ListItemText, Paper} from 'material-ui'
import {StyledListItem, TitleDiv} from "./Layers.style";
import {connect} from 'react-redux';
import Rnd from 'react-rnd'
import {LayerData} from "reducers/layout";
import {setActiveLayer} from "actions/builder";
import {RootState} from "store/type";
import {currentLayoutData} from "selectors";
import {updateLayer} from "actions/layout";

export interface LayersProps {
  layers: LayerData[]
  activeLayerId: number
  setActiveLayer: (layerId: number) => void
  updateLayer: (layer: Partial<LayerData>) => void
  className?: string
}

export interface LayersState {
}

const mapStateToProps = (state: RootState): Partial<LayersProps> => {
  return {
    layers: currentLayoutData(state).layers,
    activeLayerId: state.builder.activeLayerId
  }
}

const mapDispatchToProps = (dispatch): Partial<LayersProps>  => {
  return {
    setActiveLayer: (layerId: number) => dispatch(setActiveLayer(layerId)),
    updateLayer: (item: Partial<LayerData>) => dispatch(updateLayer({item})),
  }
}


class Layers extends React.Component<LayersProps, LayersState> {

  constructor(props: LayersProps) {
    super(props)
    this.handleSetVisible = this.handleSetVisible.bind(this)
    this.handleSetActive = this.handleSetActive.bind(this)
  }

  handleSetVisible(e: React.SyntheticEvent<HTMLInputElement>) {
    const index = this.props.layers.findIndex(layer => layer.id === Number(e.currentTarget.value))
    this.props.updateLayer({
      id: this.props.layers[index].id,
      visible: !this.props.layers[index].visible
    })
  }

  handleSetActive(layerId: number, e: React.MouseEvent<HTMLElement>) {
    this.props.setActiveLayer(layerId)
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
          </TitleDiv>
          <Grid container justify="center" spacing={0}>
            {layers.map((value, index) => {
              return [
                <Grid item xs={3} key={`${index}-1`}>
                  <Checkbox
                    checked={layers[index].visible}
                    onChange={this.handleSetVisible}
                    value={layers[index].id.toString()}
                  />
                </Grid>,
                <Grid item xs={9} key={`${index}-2`}>
                  <StyledListItem
                    button
                    active={activeLayerId === value.id}
                    // onClick={this.handleSetActive.bind(this, value)}
                  >
                    <ListItemText primary={value.name}/>
                  </StyledListItem>
                </Grid>
              ]
            })}
          </Grid>
        </Paper>
      </Rnd>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Layers)
