import * as React from 'react'
import {HideableDiv, } from "./styles";
import Selector from "./Selector"
import {TitleDiv} from "../../Layers/styles";
import {ReactNode} from "react";
import {connect} from "react-redux";
import Paper from "material-ui/Paper";
import {selectPaletteItem} from "../../../../actions/builder";

export interface BuilderProps {
  className?: string
  active: boolean
  title: string
  icon: ReactNode
  items: PaletteItem[]
  selectedItem: PaletteItem
  selectItem: (item: PaletteItem) => void
}

class Builder extends React.Component<BuilderProps, {}> {

  constructor(props: BuilderProps) {
    super(props)
  }

  render() {
    return (
      // styleを上書きするために必要
      <div className={this.props.className}>
        <HideableDiv className={`${this.props.active ? '' : 'hidden'}`}>
          <Paper>
            <TitleDiv className='Palette__title'>
              {this.props.icon}
              {this.props.title}
            </TitleDiv>
            <Selector
              items={this.props.items}
              selectItem={this.props.selectItem}
              selectedItem={this.props.selectedItem}
            />
          </Paper>
        </HideableDiv>
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
    selectItem: (item: PaletteItem) => dispatch(selectPaletteItem(item))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Builder)
