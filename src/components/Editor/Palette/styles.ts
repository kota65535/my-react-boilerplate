import styled from "styled-components";
import {theme} from "../../../withRoot";
import Rnd from 'react-rnd'
import {Tab, Tabs} from "material-ui";


export const StyledRnd = styled(Rnd as any)`
  z-index: 50;
  bottom: 0px;
  width: 200px;
`

export const StyledTabs = styled(Tabs as any)`
  background-color: ${theme.palette.background.paper}
`

export const StyledTab = styled(Tab as any)`
  width: 100px;
`

