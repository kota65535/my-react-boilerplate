import styled from "styled-components";
import {theme} from "../../../withRoot";
import IconButton from "material-ui/IconButton";


export const StyledIconButton = styled(IconButton as any)`
  &:hover {
    color: yellow
  }
  &.active, &:active {
    color: orange;
  }
  &.disabled {
    color: ${theme.palette.primary['700'] 
  }
`

export const VerticalDivider = styled.div`
  border-left: solid ${theme.palette.primary['900']};
  width: 0px;
  height:40px;
  //padding: 0px 0px 0px 0px;
  margin: 0px 15px 0px 15px;
  //overflow: auto2
`