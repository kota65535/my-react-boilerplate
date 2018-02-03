import * as React from 'react'
import LayersIcon from 'material-ui-icons/Layers'
import {Paper, Grid, Checkbox, ListItemText} from 'material-ui'
import {StyledListItem, TitleDiv} from "./Layers.style";
import {connect} from 'react-redux';
import Rnd from 'react-rnd'
import {LayerData} from "reducers/layout";
import {setActiveLayer} from "actions/builder";
import {setLayerVisible} from "actions/layout";
import {RootState} from "store/type";

export interface LayersProps {
  layers: LayerData[]
  activeLayerId: number
  setActiveLayer: (layerId: number) => void
  setLayerVisible: (layerId: number, visible: boolean) => void
  className?: string
}

export interface LayersState {
}

class Layers extends React.Component<LayersProps, LayersState> {

  constructor(props: LayersProps) {
    super(props)
    this.handleSetVisible = this.handleSetVisible.bind(this)
    this.handleSetActive = this.handleSetActive.bind(this)
  }

  handleSetVisible(e: React.SyntheticEvent<HTMLInputElement>) {
    this.props.setLayerVisible(Number(e.currentTarget.value), e.currentTarget.checked)
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
                <Grid item xs={2}>
                  <Checkbox
                    checked={layers[index].visible}
                    onChange={this.handleSetVisible}
                    value={layers[index].id.toString()}
                  />
                </Grid>,
                <Grid item xs={10}>
                  <StyledListItem
                    button
                    active={activeLayerId === value.id}
                    onClick={this.handleSetActive.bind(this, value)}
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

const mapStateToProps = (state: RootState) => {
  return {
    activeLayerId: state.builder.activeLayerId
  }
};

const mapDispatchToProps = dispatch => {
  return {
    setActiveLayer: (layerId: number) => dispatch(setActiveLayer(layerId)),
    setLayerVisible: (layerId: number, visible: boolean) => dispatch(setLayerVisible({layerId, visible}))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Layers)
