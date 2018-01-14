import * as React from 'react'
import {List, ListItemText} from 'material-ui'
import {StyledListItem} from "./styles";

export interface SelectorProps {
  items: PaletteItem[]
  selectedItem: PaletteItem
  selectItem: (item: PaletteItem) => void
}


export default class Selector extends React.Component<SelectorProps, {}> {

  constructor(props: SelectorProps) {
    super(props)
  }

  handleClick = (value: PaletteItem, e: React.MouseEvent<HTMLInputElement>) => {
    this.props.selectItem(value)
  }

  render() {
    return (
      <List>
        {this.props.items.map((value) => {
          return [
              <StyledListItem
                button
                active={this.props.selectedItem.name === value.name}
                // TODO: Performance issue?
                onClick={this.handleClick.bind(this, value)}
              >
                <ListItemText primary={value.name}/>
              </StyledListItem>
          ]
        })}
      </List>
    )
  }
}

