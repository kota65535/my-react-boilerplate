import * as React from 'react'

import {ListItem} from "material-ui";
import {ListItemProps} from "material-ui/List";

export interface ItemProps {
  className?: string
  active?: boolean
}

export default class Item extends React.Component<ItemProps & ListItemProps, {}> {

  render() {
    return (
      <ListItem {...this.props}>
      </ListItem>
    )
  }
}
