import * as React from 'react'
import {Paper, Grid, Checkbox, ListItemText, Tabs, Tab, ListItemIcon} from 'material-ui'
import List from "material-ui/List";
import {StyledListItem} from "./styles";
import Selector from "./Selector"
import {connect} from "react-redux";
import data from "../../../../constants/builderPaletteItems.json"
import {selectItem} from "../../../../actions/tools";
import {TitleDiv} from "../../Layers/styles";

export interface BuilderProps {
  title: string
  selectedItem: PaletteItem
  selectItem: (item: PaletteItem) => void
}

export interface BuilderState {
  currentItemType: string
}

const STRAIGHT_RAILS = "Straight Rails"
const CURVE_RAILS = "Curve Rails"
const TURNOUTS = "Turnouts"

const ITEM_TYPES = [
  STRAIGHT_RAILS,
  CURVE_RAILS,
  TURNOUTS
]




export class Builder extends React.Component<BuilderProps, BuilderState> {

  private lastSelectedItems: any

  constructor(props: BuilderProps) {
    super(props)
    this.state = {
      currentItemType: STRAIGHT_RAILS,
    }
    this.lastSelectedItems = {
      [STRAIGHT_RAILS]: data[STRAIGHT_RAILS].find(r => r.name === "S280"),
      [CURVE_RAILS]: data[CURVE_RAILS].find(r => r.name === "C280-45"),
      [TURNOUTS]: data[TURNOUTS].find(r => r.name === "PR541-15"),
    }
  }

  handleClicked = (type: string, e: React.MouseEvent<HTMLElement>) => {
    this.setState({
      currentItemType: type
    })
    this.props.selectItem(this.lastSelectedItems[type])
  }

  componentDidUpdate () {
    this.lastSelectedItems = {
      ...this.lastSelectedItems,
      [this.state.currentItemType]: this.props.selectedItem
    }
  }


  render() {
    return (
      <div>
          <TitleDiv>
            {/*<LayersIcon />*/}
            {this.props.title}
          </TitleDiv>
          <Selector
            items={data[this.state.currentItemType]}
            selectItem={this.props.selectItem}
            selectedItem={this.props.selectedItem}
          />
      </div>
    )
  }
}


const mapStateToProps = (state: RootState) => {
  return {
    selectedItem: state.builder.selectedItem
  }
};

const mapDispatchToProps = dispatch => {
  return {
    selectItem: (item: PaletteItem) => dispatch(selectItem(item))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Builder)
