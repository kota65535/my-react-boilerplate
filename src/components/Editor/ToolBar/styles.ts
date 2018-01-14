import styled from "styled-components";
import {theme} from "../../../withRoot";
import IconButton from "material-ui/IconButton";


export const StyledIconButton = styled(IconButton as any)`
  &:hover {
      color: yellow
    }
  &.active, &:active {
      color: orange;
`

export const VerticalDivider = styled.div`
  border-left: solid #ff0000;
  //display: block;
  //flex-grow: 1;
  //width: 1px;
  //top: 0px;
  //bottom: 0px;
  position: relative;
  height: 100%;
  flex: 1;
  //overflow: auto;
`