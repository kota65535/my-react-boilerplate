import * as React from 'react'
import LayersIcon from 'material-ui-icons/Layers'
import {Paper, Grid, Checkbox, ListItemText, Tabs, Tab} from 'material-ui'
import {StyledRnd} from "./styles";

export interface PaletteProps {
  // layers: string[]
  // visible: boolean[]
  // activeLayer: string
  // setActiveLayer: (layer: string) => void
  // setLayerVisible: (visible: boolean[]) => void
  value: string
}


export class Palette extends React.Component<PaletteProps, {}> {

  constructor(props: PaletteProps) {
    super(props)
  }

  render() {
    return (
      <StyledRnd
        enableResizing={{}}
        // dragHandleClassName=''
      >
        <Paper>
          <Tabs
            value={this.props.value}
          >
            <Tab label="Item One" >
              <div>
                {/*<h2 style={styles.headline}>Tab One</h2>*/}
                <p>
                  This is an example tab.
                </p>
                <p>
                  You can put any sort of HTML or react component in here. It even keeps the component state!
                </p>
              </div>
            </Tab>
            <Tab label="Item Two" >
              <div>
                {/*<h2 style={styles.headline}>Tab Two</h2>*/}
                <p>
                  This is another example tab.
                </p>
              </div>
            </Tab>
          </Tabs>
        </Paper>
      </StyledRnd>
    )
  }
}

// const mapStateToProps = (state: RootState) => {
//   return {
//     activeLayer: state.layers.activeLayer,
//     visible: state.layers.visible
//   }
// };
//
// const mapDispatchToProps = dispatch => {
//   return {
//     setActiveLayer: (layer: string) => dispatch(setActiveLayer(layer)),
//     setLayerVisible: (visible: boolean[]) => dispatch(setLayerVisible(visible))
//   }
// };
//
// export default connect(mapStateToProps, mapDispatchToProps)(Layers)
