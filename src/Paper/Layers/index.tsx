import * as React from 'react'
import LayersIcon from 'material-ui-icons/Layers'
import {Paper, Grid, Checkbox, ListItemText} from 'material-ui'
import {StyledItem, StyledRnd, TitleDiv} from "./styles";
import {connect} from 'react-redux';
import {setActiveLayer, setLayerVisible} from "../../actions/tools";

export interface LayersProps {
  layers: string[]
  visible: boolean[]
  activeLayer: string
  setActiveLayer: (layer: string) => void
  setLayerVisible: (visible: boolean[]) => void
}

export interface LayersState {
}

export class Layers extends React.Component<LayersProps, LayersState> {

  constructor(props: LayersProps) {
    super(props)
    this.handleSetVisible = this.handleSetVisible.bind(this)
    this.handleSetActive = this.handleSetActive.bind(this)
  }

  handleSetVisible(e: React.SyntheticEvent<HTMLInputElement>) {
    let layerIndex = this.props.layers.indexOf(e.currentTarget.value)
    let checked = e.currentTarget.checked
    let newVisible = Object.assign([], this.props.visible, {[layerIndex]: checked});
    this.props.setLayerVisible(newVisible)
  }

  handleSetActive(value: string, e: React.MouseEvent<HTMLElement>) {
    this.props.setActiveLayer(value)
  }


  render() {
    return (
      <StyledRnd
        // size={{ width: this.state.width,  height: this.state.height }}
        enableResizing={{}}
        // onResize={(e, direction, ref, delta, position) => {
        //   this.setState({
        //     width: ref.offsetWidth,
        //   });
        // }}
        dragHandleClassName='.Layers__title'
      >
        <Paper>
          <TitleDiv className='Layers__title'>
            <LayersIcon />
            Layers
          </TitleDiv>
          <Grid container justify="center" spacing={0}>
            {this.props.layers.map((value, index) => {
              return [
                  <Grid item xs={2}>
                    <Checkbox
                      checked={this.props.visible[index]}
                      onChange={this.handleSetVisible}
                      value={value}
                    />
                  </Grid>,
                  <Grid item xs={10}>
                    <StyledItem
                      button
                      active={this.props.activeLayer === value}
                      onClick={this.handleSetActive.bind(this, value)}
                      >
                      <ListItemText primary={value}/>
                    </StyledItem>
                  </Grid>
              ]
            })}
          </Grid>
        </Paper>
      </StyledRnd>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    activeLayer: state.layers.activeLayer,
    visible: state.layers.visible
  }
};

const mapDispatchToProps = dispatch => {
  return {
    setActiveLayer: (layer: string) => dispatch(setActiveLayer(layer)),
    setLayerVisible: (visible: boolean[]) => dispatch(setLayerVisible(visible))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Layers)
