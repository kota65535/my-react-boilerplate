import * as React from 'react'

import {ListItem} from "material-ui";
import {ListItemProps} from "material-ui/List";
import styled from "styled-components";
import {theme} from "withRoot";
import ActiveListItem from "components/common/ActiveListItem";

export interface ActiveListItemProps extends ListItemProps {
  className?: string
  active?: boolean
}

export default class Renamable extends React.Component<ActiveListItemProps, {}> {

  render() {
    return (
      <ListItem {...this.props}>
      </ListItem>
    )
  }
}

export const PrimaryColoredActiveListItem = styled(ActiveListItem)`
  && { 
    background-color: ${props => props.active ? theme.palette.primary[400] : theme.palette.background.default};
    :hover {
      background-color: ${props => props.active ? theme.palette.primary[500] : theme.palette.grey[200]};
    }
  }
`
